"""
The main application window class. Manages UI, data loading, thread orchestration,
and state monitoring for the browser automation suite.
"""
from typing import Dict, List, Any, Optional
import pandas as pd

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLineEdit, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox, QFileDialog, QApplication,
    QAbstractItemView
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QBrush

from core.data_handler import DataIngestor
from browsers.chrome import ChromeManager
from config import settings
from .theme import get_main_stylesheet
from .dialogs import EditInstanceDialog, AddInstanceDialog

try:
    import win32gui
    import win32con
    PYWIN32_AVAILABLE = True
except ImportError:
    PYWIN32_AVAILABLE = False

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Omni-Booking Automation Suite :: TLS Germany")
        self.setGeometry(100, 100, 1400, 700)

        self.data_ingestor = DataIngestor()
        self.active_instances: Dict[str, ChromeManager] = {}
        self.account_to_row: Dict[str, int] = {}
        self.flash_state = False 
        self.open_dialogs: List[EditInstanceDialog] = []

        # --- GLOBAL THEME SETUP ---
        self.current_theme = getattr(settings, 'APP_THEME', 'dark')
        settings.APP_THEME = self.current_theme 

        self._init_ui()

        self.monitor_timer = QTimer(self)
        self.monitor_timer.timeout.connect(self._update_dashboard)
        self.monitor_timer.start(500)

        # Apply initial theme globally to the whole app on startup
        QApplication.instance().setStyleSheet(get_main_stylesheet(self.current_theme))
        self._update_theme_btn_style()

    def _init_ui(self):
        central_widget = QWidget()
        central_widget.setObjectName("central_widget") # CRITICAL: allows theme.py to color the background
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # --- TOP FRAME ---
        top_layout = QHBoxLayout()
        
        # Apple-Style Compact Pill Toggle Button
        self.theme_btn = QPushButton()
        self.theme_btn.setFixedSize(75, 26)
        self.theme_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.theme_btn.clicked.connect(self._toggle_theme)

        self.data_source_entry = QLineEdit()
        self.data_source_entry.setPlaceholderText("Enter local file path or Google Sheet URL")
        browse_btn = QPushButton("Browse Files...")
        browse_btn.clicked.connect(self._browse_local_file)
        fetch_btn = QPushButton("Fetch Cloud Sheet")
        fetch_btn.clicked.connect(self._fetch_google_sheet)

        top_layout.addWidget(self.theme_btn)
        top_layout.addSpacing(10)
        top_layout.addWidget(self.data_source_entry)
        top_layout.addWidget(browse_btn)
        top_layout.addWidget(fetch_btn)
        main_layout.addLayout(top_layout)

        # --- MIDDLE FRAME ---
        self.table = QTableWidget()
        self.table.setColumnCount(10)
        self.table.setHorizontalHeaderLabels([
            "🔔", "", "Target Account Context", "Target City", "Target Month", 
            "Operational State (Status)", "Next Check", "Trigger Matrix (H:M:S.ms)", 
            "Network Tunnel Routing (Proxy)", "Actions"
        ])
        
        self.table.verticalHeader().setDefaultSectionSize(36)
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(3, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(4, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(6, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(7, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(8, QHeaderView.ResizeMode.ResizeToContents)
        header.setSectionResizeMode(9, QHeaderView.ResizeMode.ResizeToContents)

        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        self.table.cellDoubleClicked.connect(self._open_edit_dialog)
        main_layout.addWidget(self.table)

        # --- BOTTOM FRAME ---
        bottom_layout = QHBoxLayout()
        deploy_btn = QPushButton("⚡ Deploy All Engines")
        deploy_btn.setObjectName("deployButton")
        deploy_btn.clicked.connect(self._deploy_all)

        add_instance_btn = QPushButton("➕ Add Instance")
        add_instance_btn.clicked.connect(self._add_instance_manually)

        edit_btn = QPushButton("⚙️ Hot-Patch Highlighted")
        edit_btn.clicked.connect(self._open_edit_dialog)

        select_all_btn = QPushButton("Select All")
        select_all_btn.clicked.connect(self._select_all)

        deselect_all_btn = QPushButton("Deselect All")
        deselect_all_btn.clicked.connect(self._deselect_all)

        terminate_selected_btn = QPushButton("Terminate Selected")
        terminate_selected_btn.clicked.connect(self._terminate_selected)

        delete_selected_btn = QPushButton("Delete Selected")
        delete_selected_btn.setStyleSheet("background-color: #7f1d1d; color: #f1f5f9;")
        delete_selected_btn.clicked.connect(self._delete_selected)

        terminate_all_btn = QPushButton("🛑 Terminate Suite")
        terminate_all_btn.setObjectName("terminateSuiteButton")
        terminate_all_btn.clicked.connect(self._terminate_all)

        bottom_layout.addWidget(deploy_btn)
        bottom_layout.addWidget(add_instance_btn)
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

    def _toggle_theme(self):
        """Toggles the theme globally and reapplies it to all GUI components."""
        self.current_theme = 'light' if self.current_theme == 'dark' else 'dark'
        settings.APP_THEME = self.current_theme 
        
        QApplication.instance().setStyleSheet(get_main_stylesheet(self.current_theme))
        self._update_theme_btn_style()
            
        for dialog in self.open_dialogs:
            dialog.update_theme(self.current_theme)

    def _update_theme_btn_style(self):
        """Applies the sleek Apple-style pill CSS to the theme button"""
        if self.current_theme == 'dark':
            self.theme_btn.setText("☀️ Light")
            self.theme_btn.setStyleSheet("""
                QPushButton { background-color: #34C759; color: white; border-radius: 13px; font-weight: bold; font-size: 11px; }
                QPushButton:hover { background-color: #30B753; }
            """)
        else:
            self.theme_btn.setText("🌙 Dark")
            self.theme_btn.setStyleSheet("""
                QPushButton { background-color: #E2E8F0; color: #475569; border-radius: 13px; font-weight: bold; font-size: 11px; }
                QPushButton:hover { background-color: #CBD5E1; }
            """)

    def _browse_local_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Data File", "", "Data Files (*.xlsx *.xls *.csv)")
        if file_path:
            self.data_source_entry.setText(file_path)
            self._load_data(file_path)

    def _fetch_google_sheet(self):
        url = self.data_source_entry.text().strip()
        if "docs.google.com" not in url:
            QMessageBox.critical(self, "Invalid URL", "Please enter a valid Google Sheets URL.")
            return
        self._load_data(url)

    def _load_data(self, source: str):
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
        self.table.setRowCount(0)
        self.active_instances.clear()
        self.account_to_row.clear()

        for i, row_data in enumerate(data):
            account = row_data.get('Account', f'N/A_{i}')
            month_key = next((k for k in row_data if 'month' in str(k).lower()), None)
            year_key = next((k for k in row_data if 'year' in str(k).lower()), None)
            month = str(row_data.get(month_key, '')).strip() if month_key and pd.notna(row_data.get(month_key)) else settings.DEFAULT_INSTANCE_SETTINGS['month']
            year_val = row_data.get(year_key) if year_key else None
            year = str(int(float(year_val))) if year_val and pd.notna(year_val) and str(year_val).replace('.', '', 1).isdigit() else str(settings.DEFAULT_INSTANCE_SETTINGS['year'])
            target_month_str = f"{month} {year}".strip()
            target_city_str = str(row_data.get('City', '')).strip() or settings.DEFAULT_INSTANCE_SETTINGS['city']

            manager = ChromeManager(
                account=account, password=row_data.get('Password', ''),
                target_month=target_month_str, target_city=target_city_str,
                url=settings.BASE_URL,
                target_hr=int(row_data.get('Hour') if pd.notna(row_data.get('Hour')) else settings.DEFAULT_INSTANCE_SETTINGS.get('Hour', 0)),
                target_min=int(row_data.get('Minute') if pd.notna(row_data.get('Minute')) else settings.DEFAULT_INSTANCE_SETTINGS.get('Minute', 0)),
                target_sec=int(row_data.get('Second') if pd.notna(row_data.get('Second')) else settings.DEFAULT_INSTANCE_SETTINGS['Second']),
                target_ms=int(row_data.get('Millisecond') if pd.notna(row_data.get('Millisecond')) else settings.DEFAULT_INSTANCE_SETTINGS['Millisecond']),
                proxy_address=row_data.get('Proxy') if row_data.get('Proxy') != 'None' else None
            )
            self.active_instances[account] = manager
            self.account_to_row[account] = i
            self.table.insertRow(i)

            status_icon_item = QTableWidgetItem("")
            status_icon_item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            status_icon_item.setFlags(status_icon_item.flags() & ~Qt.ItemFlag.ItemIsEditable)
            self.table.setItem(i, 0, status_icon_item)

            check_item = QTableWidgetItem()
            check_item.setFlags(Qt.ItemFlag.ItemIsUserCheckable | Qt.ItemFlag.ItemIsEnabled)
            check_item.setCheckState(Qt.CheckState.Unchecked)
            self.table.setItem(i, 1, check_item)

            self.table.setItem(i, 2, QTableWidgetItem(account))
            self.table.setItem(i, 3, QTableWidgetItem(manager.target_city))
            self.table.setItem(i, 4, QTableWidgetItem(manager.target_month))
            self.table.setItem(i, 5, QTableWidgetItem(manager.status))
            self.table.setItem(i, 6, QTableWidgetItem(""))
            time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            self.table.setItem(i, 7, QTableWidgetItem(time_str))
            self.table.setItem(i, 8, QTableWidgetItem(str(manager.proxy_address or 'None')))
            self._add_action_buttons(i, account)

    def _add_action_buttons(self, row: int, account: str):
        actions_widget = QWidget()
        layout = QHBoxLayout(actions_widget)
        layout.setContentsMargins(5, 0, 5, 0)
        layout.setSpacing(5)

        launch_btn = QPushButton("Launch")
        launch_btn.setToolTip("Launch or focus this instance's browser window")
        launch_btn.setStyleSheet("QPushButton { background-color: #0891B2; color: white; font-size: 11px; padding: 4px 12px; font-weight: bold; border: none; border-radius: 4px; width: 65px;} QPushButton:hover { background-color: #06B6D4; }")
        launch_btn.clicked.connect(lambda checked, acc=account: self._launch_or_view_instance(acc))

        term_btn = QPushButton("Close")
        term_btn.setToolTip("Terminate this instance's process")
        term_btn.setStyleSheet("QPushButton { background-color: #D97706; color: white; font-size: 11px; padding: 4px 12px; font-weight: bold; border: none; border-radius: 4px; } QPushButton:hover { background-color: #F59E0B; }")
        term_btn.clicked.connect(lambda checked, acc=account: self._terminate_instance(acc))

        del_btn = QPushButton("Delete")
        del_btn.setToolTip("Terminate and delete this instance from the list")
        del_btn.setStyleSheet("QPushButton { background-color: #B91C1C; color: white; font-size: 11px; padding: 4px 12px; font-weight: bold; border: none; border-radius: 4px; } QPushButton:hover { background-color: #EF4444; }")
        del_btn.clicked.connect(lambda checked, acc=account: self._delete_instance(acc))

        layout.addWidget(launch_btn)
        layout.addWidget(term_btn)
        layout.addWidget(del_btn)
        layout.addStretch()
        self.table.setCellWidget(row, 9, actions_widget)

    def _deploy_all(self):
        if not self.active_instances:
            QMessageBox.information(self, "No Data", "Please load account data before deploying.")
            return
        for manager in self.active_instances.values():
            if not manager.is_running:
                manager.start_engine()

    def _add_instance_manually(self):
        dialog = AddInstanceDialog(self)
        if dialog.exec():
            account = dialog.account
            password = dialog.password

            if account in self.active_instances:
                QMessageBox.critical(self, "Instance Exists", f"An instance for '{account}' already exists.")
                return

            defaults = settings.DEFAULT_INSTANCE_SETTINGS
            target_month_str = f"{dialog.selected_month} {dialog.selected_year}"

            manager = ChromeManager(
                account=account, password=password, target_month=target_month_str,
                target_city=dialog.selected_city, url=settings.BASE_URL,
                target_hr=0, target_min=0, target_sec=defaults['Second'],
                target_ms=defaults['Millisecond'], proxy_address=None
            )
            self.active_instances[account] = manager
            i = self.table.rowCount()
            self.account_to_row[account] = i
            self.table.insertRow(i)

            status_icon_item = QTableWidgetItem("")
            status_icon_item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            status_icon_item.setFlags(status_icon_item.flags() & ~Qt.ItemFlag.ItemIsEditable)
            self.table.setItem(i, 0, status_icon_item)

            check_item = QTableWidgetItem()
            check_item.setFlags(Qt.ItemFlag.ItemIsUserCheckable | Qt.ItemFlag.ItemIsEnabled)
            check_item.setCheckState(Qt.CheckState.Unchecked)
            self.table.setItem(i, 1, check_item)

            self.table.setItem(i, 2, QTableWidgetItem(account))
            self.table.setItem(i, 3, QTableWidgetItem(manager.target_city))
            self.table.setItem(i, 4, QTableWidgetItem(manager.target_month))
            self.table.setItem(i, 5, QTableWidgetItem(manager.status))
            self.table.setItem(i, 6, QTableWidgetItem(""))
            time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            self.table.setItem(i, 7, QTableWidgetItem(time_str))
            self.table.setItem(i, 8, QTableWidgetItem("None"))
            self._add_action_buttons(i, account)

    def _terminate_all(self, silent: bool = False):
        if not self.active_instances and not silent:
            QMessageBox.information(self, "No Instances", "There are no active instances to terminate.")
            return
        for manager in self.active_instances.values():
            if manager.is_running:
                manager.stop_engine()

    def _terminate_selected(self):
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to terminate.")
            return
        for account in accounts:
            self._terminate_instance(account)

    def _terminate_instance(self, account: str):
        manager = self.active_instances.get(account)
        if manager and manager.is_running:
            manager.stop_engine()

    def _launch_or_view_instance(self, account: str):
        manager = self.active_instances.get(account)
        if not manager: return

        if not manager.is_running:
            manager.start_engine()
            return

        if not PYWIN32_AVAILABLE:
            return

        account_prefix = account.split('@')[0].lower()
        window_title_prefix = f"[OAS] | {account_prefix}"
        
        def callback(hwnd, windows):
            if win32gui.IsWindowVisible(hwnd) and window_title_prefix in win32gui.GetWindowText(hwnd).lower():
                windows.append(hwnd)
            return True
            
        windows = []
        win32gui.EnumWindows(callback, windows)

        if windows:
            hwnd = windows[0]
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            win32gui.SetForegroundWindow(hwnd)

    def _delete_instance(self, account: str):
        self._terminate_instance(account)
        row_to_remove = self.account_to_row.get(account)
        if row_to_remove is not None:
            self.table.removeRow(row_to_remove)
            if account in self.active_instances:
                del self.active_instances[account]
            self._rebuild_row_map()

    def _delete_selected(self):
        accounts = self._get_checked_accounts()
        if not accounts: return

        reply = QMessageBox.question(self, "Confirm Deletion", f"This will terminate and remove {len(accounts)} instance(s). Are you sure?", QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.No: return

        rows_to_remove = sorted([self.account_to_row[acc] for acc in accounts if acc in self.account_to_row], reverse=True)
        for row in rows_to_remove:
            account = self.table.item(row, 2).text()
            self._terminate_instance(account) 
            if account in self.active_instances: del self.active_instances[account]

        for row in rows_to_remove:
            self.table.removeRow(row)
        self._rebuild_row_map()

    def _get_checked_accounts(self) -> List[str]:
        checked_accounts = []
        for row in range(self.table.rowCount()):
            if self.table.item(row, 1).checkState() == Qt.CheckState.Checked:
                account_item = self.table.item(row, 2)
                if account_item: checked_accounts.append(account_item.text())
        return checked_accounts

    def _open_edit_dialog(self):
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows: return
        account = self.table.item(selected_rows[0].row(), 2).text()
        instance = self.active_instances.get(account)
        if instance:
            for dlg in self.open_dialogs:
                if dlg.instance == instance:
                    dlg.activateWindow()
                    dlg.raise_()
                    return
            dialog = EditInstanceDialog(self, instance, self.current_theme)
            self.open_dialogs.append(dialog)
            dialog.finished.connect(lambda: self.open_dialogs.remove(dialog))
            dialog.show()

    def _update_dashboard(self):
        self.flash_state = not self.flash_state 
        for account, manager in self.active_instances.items():
            row = self.account_to_row.get(account)
            if row is None: continue

            status_icon_item = self.table.item(row, 0)
            city_item = self.table.item(row, 3)
            month_item = self.table.item(row, 4)
            status_item = self.table.item(row, 5)

            if status_item.text() != manager.status: status_item.setText(manager.status)
            if city_item.text() != manager.target_city: city_item.setText(manager.target_city)
            if month_item.text() != manager.target_month: month_item.setText(manager.target_month)

            status_lower = manager.status.lower()

            if manager.appointment_found:
                status_icon_item.setText("🟢")
                flash_color = QColor("#10B981") if self.flash_state else QColor("#34D399")
                status_icon_item.setBackground(QBrush(flash_color))
                status_item.setBackground(QBrush(QColor("#00E5FF")))
            elif "no appointment" in status_lower or "not available" in status_lower:
                status_icon_item.setText("∅")
                status_icon_item.setBackground(QBrush(QColor("#475569")))
                status_item.setBackground(QBrush(QColor("#EF4444")))
            elif "error" in status_lower:
                status_icon_item.setText("🔴")
                status_icon_item.setBackground(QBrush(QColor("#FF4D4D")))
                status_item.setBackground(QBrush(QColor("#FF4D4D")))
            else:
                status_icon_item.setText("")
                status_icon_item.setBackground(QBrush(QColor("transparent")))
                if "refreshing" in status_lower: status_item.setBackground(QBrush(QColor("#3B82F6")))
                elif "armed" in status_lower or "executing" in status_lower or "checking" in status_lower or "scanning" in status_lower:
                    status_item.setBackground(QBrush(QColor("#00FF66")))
                elif "init" in status_lower or "launching" in status_lower or "navigating" in status_lower or "routing" in status_lower:
                    status_item.setBackground(QBrush(QColor("#FFD633")))
                else: status_item.setBackground(QBrush(QColor("#0F1420")))

            countdown_item = self.table.item(row, 6)
            if manager.countdown > 0: countdown_item.setText(f"{manager.countdown}s")
            elif countdown_item.text() != "": countdown_item.setText("")

            time_item = self.table.item(row, 7)
            new_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            if time_item.text() != new_time_str: time_item.setText(new_time_str)

    def _select_all(self):
        for row in range(self.table.rowCount()): self.table.item(row, 1).setCheckState(Qt.CheckState.Checked)

    def _deselect_all(self):
        for row in range(self.table.rowCount()): self.table.item(row, 1).setCheckState(Qt.CheckState.Unchecked)

    def _rebuild_row_map(self):
        self.account_to_row.clear()
        for row in range(self.table.rowCount()): self.account_to_row[self.table.item(row, 2).text()] = row

    def closeEvent(self, event):
        reply = QMessageBox.question(self, 'Quit', "This will terminate all running browser instances. Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No, QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.Yes:
            self._terminate_all(silent=True)
            event.accept()
        else: event.ignore()

def _patch_data_ingestor():
    def load_from_source(self, source: str) -> Dict[str, Any]:
        if "docs.google.com" in source: return self.load_from_google_sheet(source)
        elif source.endswith(('.xlsx', '.xls')): return self.load_from_excel(source)
        elif source.endswith('.csv'): return self.load_from_csv(source)
        return {"success": False, "data": [], "error": "Unsupported format.", "warnings": []}
    DataIngestor.load_from_source = load_from_source
_patch_data_ingestor()