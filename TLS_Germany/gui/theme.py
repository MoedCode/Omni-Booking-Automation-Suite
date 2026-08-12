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
        min-height: 25px;
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
    QScrollBar:vertical, QScrollBar:horizontal {
        border: none;
        background: #121824;
        width: 10px;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
        background: #334155;
        min-height: 20px;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 16px;
        font-weight: bold;
        min-height: 25px;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }

    /* ComboBox for Dropdowns */
    QComboBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
        min-height: 25px;
    }
    QComboBox::drop-down {
        border: none;
    }
    QComboBox QAbstractItemView {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #4F46E5;
        selection-background-color: #334155;
    }

    /* --- Hot-Patch Dialog Specifics --- */
    #headerTitle {
        color: #E2E8F0;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    #sectionFrame {
        background-color: #121824;
        border: 1px solid #334155;
        border-radius: 8px;
    }
    #sectionHeader {
        color: #94A3B8;
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        border-bottom: 1px solid #334155;
        padding-bottom: 6px;
        margin-bottom: 4px;
    }

    /* Month Grid */
    QPushButton#monthButton {
        background-color: #334155;
        color: #E2E8F0; /* Ensure month text is visible */
        border: 1px solid #475569;
        padding: 6px;
        font-size: 12px;
        border-radius: 6px;
    }
    QPushButton#monthButton:hover {
        background-color: #475569;
    }
    QPushButton#monthButton:checked {
        background-color: #22d3ee; /* Aqua color */
        border-color: #67e8f9;
        color: #0B0F17; /* Dark text on light aqua */
        font-weight: bold;
    }

    /* Behavior Toggles (as Switches) */
    QCheckBox {
        font-size: 13px;
        color: #cbd5e1; /* Ensure behavior text is visible */
        spacing: 10px;
    }
    QCheckBox::indicator {
        width: 40px;
        height: 22px;
        background-color: #334155;
        border-radius: 11px;
        border: 1px solid #475569;
    }
    QCheckBox::indicator:checked {
        background-color: #10B981;
    }
    QCheckBox::indicator:hover {
        border-color: #6366F1;
    }

    /* Status Pills */
    QLabel#statusKey { font-weight: bold; color: #94A3B8; font-size: 12px; }
    #greenPill { color: #34D399; font-size: 12px; font-weight: bold; font-family: 'JetBrains Mono', 'Consolas', monospace; }
    #cyanPill { color: #67E8F9; font-size: 12px; font-weight: bold; font-family: 'JetBrains Mono', 'Consolas', monospace; }
    #yellowPill { color: #FBBF24; font-size: 12px; font-weight: bold; font-family: 'JetBrains Mono', 'Consolas', monospace; }
    #purplePill { color: #F0ABFC; font-size: 12px; font-weight: bold; font-family: 'JetBrains Mono', 'Consolas', monospace; }
    
    /* Action Buttons */
    #actionsFrame QPushButton { padding: 8px; }
    #launchButton { background-color: #0891B2; color: white; } /* Cyan */
    #launchButton:hover { background-color: #06B6D4; }
    #warningButton { background-color: #D97706; color: white; }
    #warningButton:hover { background-color: #F59E0B; }
"""