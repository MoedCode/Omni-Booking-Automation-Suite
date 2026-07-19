#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/main.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())