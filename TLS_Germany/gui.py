#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/gui.py

High-performance desktop dashboard for orchestrating, visualizing, and dynamically
controlling multiple parallel browser automation pipelines using PyQt6.
"""
import os
import sys
from typing import Dict, List, Any

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLineEdit, QPushButton, QTableWidget, QTableWidgetItem, QHeaderView,
    QDialog, QLabel, QSpinBox, QMessageBox, QFileDialog, QAbstractItemView
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QBrush

from core.data_handler import DataIngestor
from browsers.chrome import ChromeManager
from config.settings import BASE_URL

# --- Global Stylesheet (QSS) for the Cyber Tactical Dark Theme ---
# This defines the entire visual profile of the application.
CYBER_DARK_STYLESHEET = """
    /* Main Window & Dialogs */
    QMainWindow, QDialog {
        background-color: #0B0F17; /* Deep Canvas Charcoal/Navy */
    }

    /* Labels */
    QLabel {
        color: #94A3B8; /* Slate Gray */
        font-size: 14px;
    }

    /* Input Fields */
    QLineEdit {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
    }
    QLineEdit:focus {
        border-color: #4F46E5; /* Indigo for focus */
    }

    /* Buttons */
    QPushButton {
        background-color: #334155; /* Slate */
        color: #E2E8F0;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #475569;
    }
    QPushButton:pressed {
        background-color: #1E293B;
    }

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {
        background-color: #2563EB; /* Blue */
        color: white;
    }
    QPushButton#deployButton:hover {
        background-color: #3B82F6;
    }

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {
        background-color: #991B1B; /* Dark Crimson */
        color: white;
    }
    QPushButton#terminateSuiteButton:hover {
        background-color: #B91C1C;
    }

    /* Table Widget */
    QTableWidget {
        background-color: #121824; /* Panel Container */
        color: #94A3B8;
        border: 1px solid #334155;
        gridline-color: #1E293B;
        font-size: 13px;
    }

    /* Table Header */
    QHeaderView::section {
        background-color: #1E293B;
        color: #94A3B8;
        padding: 8px;
        border: 1px solid #334155;
        font-weight: bold;
    }

    /* Table Cells */
    QTableWidget::item {
        padding: 8px;
        border-bottom: 1px solid #1E293B;
    }
    QTableWidget::item:selected {
        background-color: #334155;
        color: #F1F5F9;
    }

    /* Scrollbars */
    QScrollBar:vertical {
        border: none;
        background: #121824;
        width: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical {
        background: #334155;
        min-height: 20px;
        border-radius: 5px;
    }
    QScrollBar:horizontal {
        border: none;
        background: #121824;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:horizontal {
        background: #334155;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }
"""

class EditInstanceDialog(QDialog):
    """
    A modal dialog for live editing of a ChromeManager's target time parameters.
    Changes are "hot-patched" directly into the running instance's memory.
    """
    def __init__(self, parent, instance: ChromeManager):
        super().__init__(parent)
        self.instance = instance

        self.setWindowTitle(f"Hot-Patch: {instance.account}")
        self.setModal(True)
        self.setFixedSize(300, 420)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title_label = QLabel(f"Target: {instance.account}")
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #E2E8F0;")
        layout.addWidget(title_label)

        # Create spin boxes for time editing
        self.hour_spin = self._create_spinbox(layout, "Target Hour (0-23):", 0, 23, instance.target_hr)
        self.min_spin = self._create_spinbox(layout, "Target Minute (0-59):", 0, 59, instance.target_min)
        self.sec_spin = self._create_spinbox(layout, "Target Second (0-59):", 0, 59, instance.target_sec)
        self.ms_spin = self._create_spinbox(layout, "Millisecond Pulse (0-999):", 0, 999, instance.target_ms)

        layout.addStretch()

        # Action Buttons
        button_layout = QHBoxLayout()
        apply_btn = QPushButton("Apply Pulse")
        apply_btn.clicked.connect(self._apply_changes)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(apply_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _create_spinbox(self, layout: QVBoxLayout, label_text: str, min_val: int, max_val: int, initial_val: int) -> QSpinBox:
        """Helper to create a labeled spinbox."""
        layout.addWidget(QLabel(label_text))
        spinbox = QSpinBox()
        spinbox.setRange(min_val, max_val)
        spinbox.setValue(initial_val)
        layout.addWidget(spinbox)
        return spinbox

    def _apply_changes(self):
        """
        Validates the new time values and applies them directly to the
        ChromeManager instance's attributes.
        """
        new_hr = self.hour_spin.value()
        new_min = self.min_spin.value()
        new_sec = self.sec_spin.value()
        new_ms = self.ms_spin.value()

        # Direct memory update. This is thread-safe for simple assignments.
        # The background thread's timing loop will pick up these new values.
        self.instance.target_hr = new_hr
        self.instance.target_min = new_min
        self.instance.target_sec = new_sec
        self.instance.target_ms = new_ms

        print(f"[⚙️] Hot-Patch applied to {self.instance.account}. New target: {new_hr:02}:{new_min:02}:{new_sec:02}.{new_ms:03}")
        self.accept()


class AutomationDashboard(QMainWindow):
    """
    The main application window class. Manages UI, data loading, thread orchestration,
    and state monitoring for the browser automation suite.
    """
    def __init__(self):
        super().__init__()

        # --- Core Application Setup ---
        self.setWindowTitle("Omni-Booking Automation Suite :: TLS Germany")
        self.setGeometry(100, 100, 1200, 700)
        self.setStyleSheet(CYBER_DARK_STYLESHEET)

        # --- State Management ---
        self.data_ingestor = DataIngestor()
        # Maps table row index to its corresponding ChromeManager instance
        self.active_instances: Dict[int, ChromeManager] = {}

        # --- UI Initialization ---
        self._init_ui()

        # --- Background Processes ---
        self.monitor_timer = QTimer(self)
        self.monitor_timer.timeout.connect(self._update_ui_from_monitor)
        self.monitor_timer.start(500) # Poll every 500ms

    def _init_ui(self):
        """Constructs and lays out all GUI elements."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # --- Data Ingestion Widgets (Top Frame) ---
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

        # --- Instance Tracker (Treeview in Middle Frame) ---
        self.table = QTableWidget()
        self.table.setColumnCount(4)
        self.table.setHorizontalHeaderLabels([
            "Target Account Context", "Operational State (Status)",
            "Trigger Matrix (H:M:S.ms)", "Network Tunnel Routing (Proxy)"
        ])
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.Interactive)
        self.table.setColumnWidth(0, 350)
        self.table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        self.table.cellDoubleClicked.connect(self._open_edit_dialog)
        main_layout.addWidget(self.table)

        # --- Control Panel (Bottom Frame) ---
        bottom_layout = QHBoxLayout()
        deploy_btn = QPushButton("⚡ Deploy All Engines")
        deploy_btn.setObjectName("deployButton")
        deploy_btn.clicked.connect(self._deploy_all)

        edit_btn = QPushButton("⚙️ Hot-Patch Selected")
        edit_btn.clicked.connect(self._open_edit_dialog)

        terminate_selected_btn = QPushButton("❌ Terminate Selected")
        terminate_selected_btn.clicked.connect(self._terminate_selected)

        terminate_all_btn = QPushButton("🛑 Terminate Suite")
        terminate_all_btn.setObjectName("terminateSuiteButton")
        terminate_all_btn.clicked.connect(self._terminate_all)

        bottom_layout.addWidget(deploy_btn)
        bottom_layout.addWidget(edit_btn)
        bottom_layout.addWidget(terminate_selected_btn)
        bottom_layout.addStretch()
        bottom_layout.addWidget(terminate_all_btn)
        main_layout.addLayout(bottom_layout)

    # --- Data Loading and UI Population ---

    def _browse_local_file(self):
        """Opens a file dialog to select a local data file."""
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select Automation Data File", "",
            "Excel files (*.xlsx *.xls);;CSV files (*.csv);;All files (*.*)"
        )
        if file_path:
            self.data_source_entry.setText(file_path)
            self._load_data(file_path)

    def _fetch_google_sheet(self):
        """Fetches data from the Google Sheet URL provided in the entry field."""
        url = self.data_source_entry.text().strip()
        if "docs.google.com" not in url:
            QMessageBox.critical(self, "Invalid URL", "Please enter a valid Google Sheets URL.")
            return
        self._load_data(url)

    def _load_data(self, source: str):
        """
        Generic data loading function that uses DataIngestor and populates the UI.
        This will terminate any existing instances before loading new data.
        """
        if self.active_instances:
            reply = QMessageBox.question(self, "Confirm",
                                         "Loading new data will terminate all running instances. Continue?",
                                         QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply == QMessageBox.StandardButton.No:
                return
            self._terminate_all(silent=True)

        # Determine loading method based on source
        if "docs.google.com" in source:
            result = self.data_ingestor.load_from_google_sheet(source)
        elif source.endswith(('.xlsx', '.xls')):
            result = self.data_ingestor.load_from_excel(source)
        elif source.endswith('.csv'):
            result = self.data_ingestor.load_from_csv(source)
        else:
            QMessageBox.critical(self, "Unsupported File", "The selected file type is not supported.")
            return

        # Handle loading errors and warnings
        if not result["success"]:
            QMessageBox.critical(self, "Data Loading Failed", result["error"])
            return
        if result["warnings"]:
            warnings = "\n".join(result["warnings"])
            QMessageBox.warning(self, "Data Loading Warnings", f"Some rows were skipped:\n\n{warnings}")

        self._populate_table(result["data"])

    def _populate_table(self, data: List[Dict[str, Any]]):
        """Clears the tree and populates it with new data, creating ChromeManager instances."""
        # Clear existing data
        self.table.setRowCount(0)
        self.active_instances.clear()

        for i, row_data in enumerate(data):
            # Ensure time values are present and are integers, defaulting to 0
            target_hr = int(row_data.get('Hour', 0))
            target_min = int(row_data.get('Minute', 0))
            target_sec = int(row_data.get('Second', 0))
            target_ms = int(row_data.get('Millisecond', 0))

            account = row_data.get('Account', 'N/A')
            password = row_data.get('Password', '')
            proxy = row_data.get('Proxy', 'None')

            # Create the manager instance for this row
            manager = ChromeManager(
                account=account,
                password=password,
                url=BASE_URL,
                target_hr=target_hr,
                target_min=target_min,
                target_sec=target_sec,
                target_ms=target_ms,
                proxy_address=proxy if proxy != 'None' else None
            )
            self.active_instances[i] = manager

            # Format data for display
            target_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            
            # Insert row into Table
            self.table.insertRow(i)
            self.table.setItem(i, 0, QTableWidgetItem(account))
            self.table.setItem(i, 1, QTableWidgetItem(manager.status))
            self.table.setItem(i, 2, QTableWidgetItem(target_time_str))
            self.table.setItem(i, 3, QTableWidgetItem(proxy))

        self.table.resizeColumnsToContents()
        self.table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeMode.Stretch)


    # --- Thread Orchestration Controls ---

    def _deploy_all(self):
        """Starts the automation engine for all loaded instances."""
        if not self.active_instances:
            QMessageBox.information(self, "No Data", "Please load account data before deploying.")
            return
        
        for manager in self.active_instances.values():
            if not manager.is_running:
                manager.start_engine()

    def _terminate_all(self, silent: bool = False):
        """Stops all running automation engines."""
        if not self.active_instances:
            if not silent:
                QMessageBox.information(self, "No Instances", "There are no active instances to terminate.")
            return
        
        for manager in self.active_instances.values():
            if manager.is_running:
                manager.stop_engine()

    def _terminate_selected(self):
        """Stops the engine for the currently selected instance in the Table."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.warning(self, "No Selection", "Please select an instance to terminate.")
            return

        row = selected_rows[0].row()
        manager = self.active_instances.get(row)
        if manager and manager.is_running:
            manager.stop_engine()
        elif manager:
            QMessageBox.information(self, "Already Stopped", "The selected instance is not running.")

    # --- Parameter Hot-Patching ---

    def _open_edit_dialog(self):
        """Opens a QDialog to edit the parameters of the selected instance."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.warning(self, "No Selection", "Please select an instance to edit.")
            return
        
        row = selected_rows[0].row()
        instance = self.active_instances.get(row)

        if instance:
            dialog = EditInstanceDialog(self, instance)
            dialog.exec() # This will block until the dialog is closed

    # --- Background Monitoring and UI Updates ---

    def _update_ui_from_monitor(self):
        """
        Runs on a QTimer. Polls the status of each ChromeManager and updates
        the UI table accordingly. This is the main polling loop.
        """
        status_colors = {
            "active": QColor("#00FF66"),    # Cyber Neon Green
            "error": QColor("#FF4D4D"),     # Soft Vibrant Red
            "loading": QColor("#FFD633"),   # Cyber Neon Yellow
            "default": QColor("#0F1420")    # Default Cell Background
        }

        for row, manager in self.active_instances.items():
            # Update Status and apply color
            status_item = self.table.item(row, 1)
            if status_item.text() != manager.status:
                status_item.setText(manager.status)
                
                color_key = "default"
                status_lower = manager.status.lower()
                if "error" in status_lower or "terminated" in status_lower:
                    color_key = "error"
                elif "armed" in status_lower or "executing" in status_lower or "dashboard" in status_lower:
                    color_key = "active"
                elif "init" in status_lower or "launching" in status_lower or "navigating" in status_lower or "routing" in status_lower:
                    color_key = "loading"
                
                status_item.setBackground(QBrush(status_colors[color_key]))

            # Update Target Time (for hot-patching)
            time_item = self.table.item(row, 2)
            new_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            if time_item.text() != new_time_str:
                time_item.setText(new_time_str)

    # --- Application Shutdown ---

    def closeEvent(self, event):
        """Handles the application close event, ensuring all threads are terminated."""
        reply = QMessageBox.question(self, 'Quit',
                                     "Do you want to quit? This will terminate all running browser instances.",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                                     QMessageBox.StandardButton.No)

        if reply == QMessageBox.StandardButton.Yes:
            self._terminate_all(silent=True)
            event.accept()
        else:
            event.ignore()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = AutomationDashboard()
    dashboard.show()
    sys.exit(app.exec())