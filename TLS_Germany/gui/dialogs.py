"""
Contains all QDialog-based pop-up windows for the application.
"""
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QSpinBox, QPushButton, QLineEdit, QMessageBox, QComboBox
)
from PyQt6.QtCore import Qt
import datetime

from browsers.chrome import ChromeManager

class AddInstanceDialog(QDialog):
    """A dialog to manually add a new bot instance."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Add New Instance")
        self.setModal(True)
        self.setFixedSize(400, 350)

        self.account = ""
        self.password = ""
        self.selected_month = ""
        self.selected_year = ""
        self.selected_city = ""
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(10)

        layout.addWidget(QLabel("Account (Email):"))
        self.account_edit = QLineEdit()
        self.account_edit.setPlaceholderText("Enter account email")
        layout.addWidget(self.account_edit)

        layout.addWidget(QLabel("Password:"))
        self.password_edit = QLineEdit()
        self.password_edit.setPlaceholderText("Enter account password")
        self.password_edit.setEchoMode(QLineEdit.EchoMode.Password)
        layout.addWidget(self.password_edit)

        layout.addWidget(QLabel("Target City:"))
        self.city_edit = QLineEdit()
        self.city_edit.setPlaceholderText("e.g., Alexandria")
        layout.addWidget(self.city_edit)

        month_year_layout = QHBoxLayout()
        
        month_layout = QVBoxLayout()
        month_layout.addWidget(QLabel("Month:"))
        self.month_combo = QComboBox()
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        self.month_combo.addItems(months)
        self.month_combo.setCurrentText(datetime.datetime.now().strftime("%B"))
        month_layout.addWidget(self.month_combo)
        month_year_layout.addLayout(month_layout)

        year_layout = QVBoxLayout()
        year_layout.addWidget(QLabel("Year:"))
        self.year_combo = QComboBox()
        years = [str(y) for y in range(2024, 2031)]
        self.year_combo.addItems(years)
        self.year_combo.setCurrentText("2026")
        year_layout.addWidget(self.year_combo)
        month_year_layout.addLayout(year_layout)

        layout.addLayout(month_year_layout)
        layout.addStretch()

        button_layout = QHBoxLayout()
        add_btn = QPushButton("Add Instance")
        add_btn.clicked.connect(self._add_instance)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(add_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _add_instance(self):
        self.account = self.account_edit.text().strip()
        self.password = self.password_edit.text().strip()
        self.selected_city = self.city_edit.text().strip()
        self.selected_month = self.month_combo.currentText()
        self.selected_year = self.year_combo.currentText()


        if not self.account or not self.password or not self.selected_city:
            QMessageBox.warning(self, "Input Required", "Account, Password, and City cannot be empty.")
            return
        
        self.accept()

class EditInstanceDialog(QDialog):
    """
    A modal dialog for live editing of a ChromeManager's target time parameters.
    Changes are "hot-patched" by directly modifying the attributes of the
    ChromeManager instance in memory while its thread is running.
    """
    def __init__(self, parent, instance: ChromeManager):
        super().__init__(parent)
        self.instance = instance

        self.setWindowTitle(f"Hot-Patch: {instance.account}")
        self.setModal(True)
        self.setFixedSize(400, 450)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title_label = QLabel(f"Target: {instance.account}")
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #E2E8F0;")
        layout.addWidget(title_label)

        layout.addWidget(QLabel("Target City:"))
        self.city_edit = QLineEdit()
        self.city_edit.setText(instance.target_city)
        layout.addWidget(self.city_edit)

        # Month and Year dropdowns
        layout.addWidget(QLabel("Target Month & Year:"))
        month_year_layout = QHBoxLayout()
        
        self.month_combo = QComboBox()
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        self.month_combo.addItems(months)
        month_year_layout.addWidget(self.month_combo)

        self.year_combo = QComboBox()
        years = [str(y) for y in range(2024, 2031)]
        self.year_combo.addItems(years)
        month_year_layout.addWidget(self.year_combo)
        layout.addLayout(month_year_layout)

        # Safely parse and set initial values
        try:
            parts = instance.target_month.strip().split()
            if len(parts) == 2:
                current_month, current_year = parts
                if current_month in months: self.month_combo.setCurrentText(current_month)
                if current_year in years: self.year_combo.setCurrentText(current_year)
        except Exception as e:
            print(f"Warning: Could not parse target_month '{instance.target_month}': {e}. Using defaults.")

        # Create spin boxes for time editing
        self.sec_spin = self._create_spinbox(layout, "Second (0-59):", 0, 59, instance.target_sec)
        self.ms_spin = self._create_spinbox(layout, "Millisecond (0-999):", 0, 999, instance.target_ms)

        layout.addStretch()

        # --- Action Buttons ---
        button_layout = QHBoxLayout()
        apply_btn = QPushButton("Apply Pulse")
        apply_btn.clicked.connect(self._apply_changes)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(apply_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _create_spinbox(self, layout: QVBoxLayout, label_text: str, min_val: int, max_val: int, initial_val: int) -> QSpinBox:
        """Factory helper to create a labeled QSpinBox and add it to the layout."""
        layout.addWidget(QLabel(label_text))
        spinbox = QSpinBox()
        spinbox.setRange(min_val, max_val)
        spinbox.setValue(initial_val)
        layout.addWidget(spinbox)
        return spinbox

    def _apply_changes(self):
        """
        Applies the new time values from the spinboxes directly to the
        ChromeManager instance's attributes. This is thread-safe for simple
        atomic assignments (like integers), and the running thread's timing loop
        is designed to read these values on each iteration.
        """
        new_month_str = f"{self.month_combo.currentText()} {self.year_combo.currentText()}"
        new_city = self.city_edit.text().strip()
        new_sec = self.sec_spin.value()
        new_ms = self.ms_spin.value()

        # Direct memory update. This is thread-safe for simple assignments.
        self.instance.target_month = new_month_str
        self.instance.target_city = new_city
        self.instance.target_sec = new_sec
        self.instance.target_ms = new_ms

        print(f"[⚙️] Hot-Patch applied to {self.instance.account}. "
              f"New Month: {new_month_str}, City: {new_city}, "
              f"Time: {self.instance.target_hr:02}:{self.instance.target_min:02}:{new_sec:02}.{new_ms:03}")
        # Close the dialog
        self.accept()