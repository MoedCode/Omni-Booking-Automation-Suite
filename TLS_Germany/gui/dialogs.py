"""
Contains all QDialog-based pop-up windows for the application.
"""
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QSpinBox, QPushButton
)
from PyQt6.QtCore import Qt

from browsers.chrome import ChromeManager

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
        self.setFixedSize(320, 420)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title_label = QLabel(f"Target: {instance.account}")
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #E2E8F0;")
        layout.addWidget(title_label)

        # Create spin boxes for time editing
        self.hour_spin = self._create_spinbox(layout, "Hour (0-23):", 0, 23, instance.target_hr)
        self.min_spin = self._create_spinbox(layout, "Minute (0-59):", 0, 59, instance.target_min)
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
        new_hr = self.hour_spin.value()
        new_min = self.min_spin.value()
        new_sec = self.sec_spin.value()
        new_ms = self.ms_spin.value()

        # Direct memory update. This is thread-safe for simple assignments.
        self.instance.target_hr = new_hr
        self.instance.target_min = new_min
        self.instance.target_sec = new_sec
        self.instance.target_ms = new_ms

        print(f"[⚙️] Hot-Patch applied to {self.instance.account}. New target: {new_hr:02}:{new_min:02}:{new_sec:02}.{new_ms:03}")
        # Close the dialog
        self.accept()