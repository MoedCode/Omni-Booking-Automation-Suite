"""
The main application window class. Manages UI, data loading, thread orchestration,
and state monitoring for the browser automation suite.
"""
from typing import Dict, List, Any, Optional

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLineEdit, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox, QFileDialog,
    QAbstractItemView
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QBrush

from core.data_handler import DataIngestor
from browsers.chrome import ChromeManager
from config.settings import BASE_URL
from .theme import CYBER_DARK_STYLESHEET
from .dialogs import EditInstanceDialog

# Attempt to import pywin32 for the "View" functionality on Windows
try:
    import win32gui
    import win32con
    PYWIN32_AVAILABLE = True
except ImportError:
    PYWIN32_AVAILABLE = False

class MainWindow(QMainWindow):
    """
    The main application window class. Manages UI, data loading, thread orchestration,
    and state monitoring for the browser automation suite.
    """
    def __init__(self):
        super().__init__()

        # --- Core Application Setup ---
        self.setWindowTitle("Omni-Booking Automation Suite :: TLS Germany")
        self.setGeometry(100, 100, 1400, 700)
        self.setStyleSheet(CYBER_DARK_STYLESHEET)

        # --- State Management ---
        self.data_ingestor = DataIngestor() # Handles loading data from files/sheets.
        # Core state dictionary: Maps an account's email (as a unique ID) to its controlling ChromeManager instance.
        self.active_instances: Dict[str, ChromeManager] = {}
        # Performance optimization: Maps an account's email to its current row index in the table for fast UI updates.
        self.account_to_row: Dict[str, int] = {}

        # --- UI Initialization ---
        self._init_ui()

        # --- Background Processes ---
        # This timer is the heart of the live dashboard, periodically calling a method to refresh the UI.
        self.monitor_timer = QTimer(self)
        self.monitor_timer.timeout.connect(self._update_dashboard_from_state)
        self.monitor_timer.start(500) # Poll every 500ms

    def _init_ui(self):
        """Constructs and lays out all GUI elements."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # --- TOP FRAME: Data Ingestion Controls ---
        top_layout = QHBoxLayout()
        self.data_source_entry = QLineEdit()
        self.data_source_entry.setPlaceholderText("Enter local file path or Google Sheet URL")
        browse_btn = QPushButton("Browse Files...")
        browse_btn.clicked.connect(self._browse_local_file)
        fetch_btn = QPushButton("Fetch Cloud Sheet")
        fetch_btn.clicked.connect(self._fetch_google_sheet)

        top_layout.addWidget(self.data_source_entry)
        top_layout.addWidget(browse_btn)
        top_layout.addWidget(fetch_btn)
        main_layout.addLayout(top_layout)

        # --- MIDDLE FRAME: Instance Tracker Table ---
        self.table = QTableWidget()
        self.table.setColumnCount(6)
        self.table.setHorizontalHeaderLabels([
            "", "Target Account Context", "Operational State (Status)",
            "Trigger Matrix (H:M:S.ms)", "Network Tunnel Routing (Proxy)", "Actions"
        ])
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents) # Checkbox
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.Interactive)   # Account
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions
        self.table.setColumnWidth(1, 350)

        # Allow selecting rows or individual cells for copy-pasting text.
        # Editing is disabled by default on QTableWidgetItems unless the 'ItemIsEditable' flag is set.
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        # Double-clicking a row still opens the edit dialog
        self.table.cellDoubleClicked.connect(self._open_edit_dialog)
        main_layout.addWidget(self.table)

        # --- BOTTOM FRAME: Main Control Panel ---
        bottom_layout = QHBoxLayout()
        deploy_btn = QPushButton("⚡ Deploy All Engines")
        deploy_btn.setObjectName("deployButton")
        deploy_btn.clicked.connect(self._deploy_all)

        edit_btn = QPushButton("⚙️ Hot-Patch Highlighted")
        edit_btn.clicked.connect(self._open_edit_dialog)

        select_all_btn = QPushButton("Select All")
        select_all_btn.clicked.connect(self._select_all)

        deselect_all_btn = QPushButton("Deselect All")
        deselect_all_btn.clicked.connect(self._deselect_all)

        terminate_selected_btn = QPushButton("Terminate Selected")
        terminate_selected_btn.clicked.connect(self._terminate_selected)

        delete_selected_btn = QPushButton("Delete Selected")
        delete_selected_btn.setStyleSheet("background-color: #7f1d1d; color: #f1f5f9;") # Dark Red
        delete_selected_btn.clicked.connect(self._delete_selected)

        terminate_all_btn = QPushButton("🛑 Terminate Suite")
        terminate_all_btn.setObjectName("terminateSuiteButton")
        terminate_all_btn.clicked.connect(self._terminate_all)

        bottom_layout.addWidget(deploy_btn)
        bottom_layout.addWidget(edit_btn)
        bottom_layout.addStretch(1)
        bottom_layout.addWidget(select_all_btn)
        bottom_layout.addWidget(deselect_all_btn)
        bottom_layout.addSpacing(20)
        bottom_layout.addWidget(terminate_selected_btn)
        bottom_layout.addWidget(delete_selected_btn)
        bottom_layout.addStretch(2)
        bottom_layout.addWidget(terminate_all_btn)
        main_layout.addLayout(bottom_layout)

    def _browse_local_file(self):
        """Opens a file dialog to select a local data file and loads it."""
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Data File", "", "Data Files (*.xlsx *.xls *.csv)")
        if file_path:
            self.data_source_entry.setText(file_path)
            self._load_data(file_path)

    def _fetch_google_sheet(self):
        """Takes the URL from the entry box and attempts to load it as a Google Sheet."""
        url = self.data_source_entry.text().strip()
        if "docs.google.com" not in url:
            QMessageBox.critical(self, "Invalid URL", "Please enter a valid Google Sheets URL.")
            return
        self._load_data(url)

    def _load_data(self, source: str):
        """
        Central data loading function. It terminates any running instances,
        calls the DataIngestor, and then populates the UI table with the new data.
        """
        # Safety check: ensure user confirms before wiping existing session.
        if self.active_instances:
            reply = QMessageBox.question(self, "Confirm", "Loading new data will terminate all running instances. Continue?",
                                         QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply == QMessageBox.StandardButton.No: return
            self._terminate_all(silent=True)

        result = self.data_ingestor.load_from_source(source)

        if not result["success"]:
            QMessageBox.critical(self, "Data Loading Failed", result["error"])
            return
        if result["warnings"]:
            warnings_text = "\n".join(result["warnings"])
            QMessageBox.warning(self, "Data Loading Warnings", f"Some rows were skipped:\n\n{warnings_text}")

        self._populate_table(result["data"])

    def _populate_table(self, data: List[Dict[str, Any]]):
        """
        Clears the current table and state, then builds new ChromeManager instances
        and UI rows for each entry in the provided data.
        """
        self.table.setRowCount(0)
        self.active_instances.clear()
        self.account_to_row.clear()

        for i, row_data in enumerate(data):
            account = row_data.get('Account', f'N/A_{i}')
            manager = ChromeManager(
                account=account,
                password=row_data.get('Password', ''),
                url=BASE_URL,
                target_hr=int(row_data.get('Hour', 0)),
                target_min=int(row_data.get('Minute', 0)),
                target_sec=int(row_data.get('Second', 0)),
                target_ms=int(row_data.get('Millisecond', 0)),
                proxy_address=row_data.get('Proxy') if row_data.get('Proxy') != 'None' else None
            )
            self.active_instances[account] = manager
            self.account_to_row[account] = i

            self.table.insertRow(i)

            # Column 0: Checkbox
            check_item = QTableWidgetItem()
            check_item.setFlags(Qt.ItemFlag.ItemIsUserCheckable | Qt.ItemFlag.ItemIsEnabled)
            check_item.setCheckState(Qt.CheckState.Unchecked)
            self.table.setItem(i, 0, check_item)

            # Column 1: Account
            self.table.setItem(i, 1, QTableWidgetItem(account))
            # Column 2: Status
            self.table.setItem(i, 2, QTableWidgetItem(manager.status))
            # Column 3: Time
            time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            self.table.setItem(i, 3, QTableWidgetItem(time_str))
            # Column 4: Proxy
            self.table.setItem(i, 4, QTableWidgetItem(str(manager.proxy_address or 'None')))
            # Column 5: Actions
            self._add_action_buttons(i, account)

        self.table.resizeColumnsToContents()
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.Stretch) # Status column
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions

    def _add_action_buttons(self, row: int, account: str):
        """
        Creates a widget containing the 'View', 'Terminate', and 'Delete' buttons
        for a single row and sets it in the 'Actions' column.
        """
        actions_widget = QWidget()
        layout = QHBoxLayout(actions_widget)
        layout.setContentsMargins(5, 0, 5, 0)
        layout.setSpacing(5)

        view_btn = QPushButton("View")
        view_btn.setToolTip("View this instance's browser window")
        view_btn.setStyleSheet("background-color: #0891B2; color: white; font-size: 12px; padding: 4px 8px; font-weight: bold;")
        view_btn.clicked.connect(lambda checked, acc=account: self._view_instance(acc))

        term_btn = QPushButton("Terminate")
        term_btn.setToolTip("Terminate this instance's process")
        term_btn.setStyleSheet("background-color: #D97706; color: white; font-size: 12px; padding: 4px 8px; font-weight: bold;")
        term_btn.clicked.connect(lambda checked, acc=account: self._terminate_instance(acc))

        del_btn = QPushButton("Delete")
        del_btn.setToolTip("Terminate and delete this instance from the list")
        del_btn.setStyleSheet("background-color: #B91C1C; color: white; font-size: 12px; padding: 4px 8px; font-weight: bold;")
        del_btn.clicked.connect(lambda checked, acc=account: self._delete_instance(acc))

        layout.addWidget(view_btn)
        layout.addWidget(term_btn)
        layout.addWidget(del_btn)
        layout.addStretch()
        self.table.setCellWidget(row, 5, actions_widget)

    def _deploy_all(self):
        """Starts the automation engine for all loaded instances that are not already running."""
        if not self.active_instances:
            QMessageBox.information(self, "No Data", "Please load account data before deploying.")
            return
        for manager in self.active_instances.values():
            if not manager.is_running:
                manager.start_engine()

    def _terminate_all(self, silent: bool = False):
        """Stops the automation engine for all running instances."""
        if not self.active_instances and not silent:
            QMessageBox.information(self, "No Instances", "There are no active instances to terminate.")
            return
        for manager in self.active_instances.values():
            if manager.is_running:
                manager.stop_engine()

    def _terminate_selected(self):
        """Terminates all instances that have their checkbox ticked."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to terminate.")
            return
        for account in accounts:
            self._terminate_instance(account)

    def _terminate_instance(self, account: str):
        """Stops the engine for a specific instance by its account ID."""
        manager = self.active_instances.get(account)
        if manager and manager.is_running:
            manager.stop_engine()

    def _view_instance(self, account: str):
        """
        Brings an instance's browser window to the foreground.
        If the instance isn't running, it will be launched first.
        NOTE: This functionality relies on the 'pywin32' library and only works on Windows.
        """
        manager = self.active_instances.get(account)
        if not manager:
            return

        # If the instance is idle, clicking 'View' is a convenient way to launch it.
        if not manager.is_running:
            print(f"[▶️] 'View' clicked on idle instance. Launching {account}...")
            manager.start_engine()
            QMessageBox.information(self, "Instance Launching", f"The browser for {account} is now being launched.")
            return

        # On non-Windows systems or if pywin32 is not installed, inform the user.
        if not PYWIN32_AVAILABLE:
            QMessageBox.warning(self, "Feature Unavailable", "The 'pywin32' library is required to focus windows. Please install it (`pip install pywin32`) and restart.\n\nThis feature is only available on Windows.")
            return

        window_title = manager.window_title
        hwnd = win32gui.FindWindow(None, window_title)

        # If we found the window handle, use it to restore and focus the window.
        if hwnd:
            print(f"[👁️] Found window for {account} (HWND: {hwnd}). Bringing to front.")
            # Restore if minimized
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            # Bring to foreground
            win32gui.SetForegroundWindow(hwnd)
        else:
            QMessageBox.warning(self, "Window Not Found", f"Could not find the browser window for {account}.\nIt might still be launching or may have been closed manually.")

    def _delete_instance(self, account: str):
        """Terminates and removes an instance entirely from the UI and state."""
        self._terminate_instance(account)

        row_to_remove = self.account_to_row.get(account)
        if row_to_remove is not None:
            self.table.removeRow(row_to_remove)
            if account in self.active_instances:
                del self.active_instances[account]
            # The row map will be incorrect after this, so we rebuild it.
            self._rebuild_row_map()

    def _delete_selected(self):
        """Terminates and removes all checked instances."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to delete.")
            return

        reply = QMessageBox.question(self, "Confirm Deletion", f"This will terminate and remove {len(accounts)} instance(s). Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.No:
            return

        # Get a static list of rows to remove, sorted descending to avoid index errors
        rows_to_remove = sorted([self.account_to_row[acc] for acc in accounts if acc in self.account_to_row], reverse=True)

        for row in rows_to_remove:
            # Find account for this row before it's deleted (account is in column 1)
            account = self.table.item(row, 1).text()
            self._terminate_instance(account) # Stop thread
            if account in self.active_instances:
                del self.active_instances[account]

        # Remove rows from the table UI after processing
        for row in rows_to_remove:
            self.table.removeRow(row)

        # Finally, rebuild the clean mapping from account to the new row indices
        self._rebuild_row_map()

    def _get_checked_accounts(self) -> List[str]:
        """Returns a list of account names for all checked rows."""
        checked_accounts = []
        for row in range(self.table.rowCount()):
            # Checkbox is in column 0
            if self.table.item(row, 0).checkState() == Qt.CheckState.Checked:
                # Account is in column 1
                account_item = self.table.item(row, 1)
                if account_item:
                    checked_accounts.append(account_item.text())
        return checked_accounts

    def _open_edit_dialog(self):
        """Opens the 'Hot-Patch' dialog for the currently highlighted row in the table."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.warning(self, "No Selection", "Please highlight a single instance to edit.")
            return
        # Account is in column 1
        account = self.table.item(selected_rows[0].row(), 1).text()
        instance = self.active_instances.get(account)
        if instance:
            dialog = EditInstanceDialog(self, instance)
            dialog.exec()

    def _update_dashboard_from_state(self):
        """
        The heart of the dashboard's live updates. This method is called by a QTimer.
        It iterates through all active instances, reads their current state (status, time), and updates the UI table.
        """
        status_colors = {
            "active": QColor("#00FF66"), "error": QColor("#FF4D4D"),
            "loading": QColor("#FFD633"), "default": QColor("#0F1420")
        }

        for account, manager in self.active_instances.items():
            row = self.account_to_row.get(account)
            if row is None: continue

            # Update the 'Operational State (Status)' column and apply color-coding.
            status_item = self.table.item(row, 2)
            if status_item.text() != manager.status:
                status_item.setText(manager.status)
                status_lower = manager.status.lower()
                color_key = "default"
                if "error" in status_lower or "terminated" in status_lower: color_key = "error"
                elif "armed" in status_lower or "executing" in status_lower or "dashboard" in status_lower: color_key = "active"
                elif "init" in status_lower or "launching" in status_lower or "navigating" in status_lower or "routing" in status_lower: color_key = "loading"
                status_item.setBackground(QBrush(status_colors[color_key]))

            # Update the 'Trigger Matrix' column. This ensures changes from the Hot-Patch dialog are reflected.
            time_item = self.table.item(row, 3)
            new_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            if time_item.text() != new_time_str:
                time_item.setText(new_time_str)

    def _select_all(self):
        """Sets all row checkboxes to checked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Checked)

    def _deselect_all(self):
        """Sets all row checkboxes to unchecked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Unchecked)

    def _rebuild_row_map(self):
        """
        Clears and rebuilds the account-to-row index map.
        This is a crucial maintenance step to call after any row(s) are deleted from the table,
        ensuring the fast lookup map doesn't point to incorrect or non-existent rows.
        """
        self.account_to_row.clear()
        for row in range(self.table.rowCount()):
            self.account_to_row[self.table.item(row, 1).text()] = row

    def closeEvent(self, event):
        """Handles the application close event, ensuring all threads are terminated."""
        reply = QMessageBox.question(self, 'Quit', "This will terminate all running browser instances. Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                                     QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.Yes:
            self._terminate_all(silent=True)
            event.accept()
        else:
            event.ignore()


def _patch_data_ingestor():
    """Dynamically adds a generic load_from_source method to DataIngestor."""
    def load_from_source(self, source: str) -> Dict[str, Any]:
        if "docs.google.com" in source:
            return self.load_from_google_sheet(source)
        elif source.endswith(('.xlsx', '.xls')):
            return self.load_from_excel(source)
        elif source.endswith('.csv'):
            return self.load_from_csv(source)
        return {"success": False, "data": [], "error": "Unsupported file or URL format.", "warnings": []}
    DataIngestor.load_from_source = load_from_source

_patch_data_ingestor()