"""Generate an optional one-page alternate CV draft from portfolio facts.

Run: python3 scripts/generate_resume.py
The public portfolio serves the owner's original uploaded three-page CV.
This script intentionally does not overwrite that original. Always confirm
degree dates, role wording and project attribution before using this draft.
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


DEST = Path(__file__).resolve().parents[1] / "tmp" / "Yakhrevan_S_Resume_generated_draft.pdf"
FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DejaVu", str(FONT_DIR / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DejaVuBold", str(FONT_DIR / "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFontFamily("DejaVu", normal="DejaVu", bold="DejaVuBold")

NAVY = colors.HexColor("#10283f")
BLUE = colors.HexColor("#1962bf")
MUTED = colors.HexColor("#506477")
HAIR = colors.HexColor("#d9e6ef")


def style(name, size, leading, *, bold=False, color=NAVY, space_after=0):
    return ParagraphStyle(
        name=name, fontName="DejaVuBold" if bold else "DejaVu", fontSize=size,
        leading=leading, textColor=color, alignment=TA_LEFT, spaceAfter=space_after,
        allowWidows=0, allowOrphans=0,
    )


NAME = style("name", 22, 26, bold=True)
ROLE = style("role", 10, 16, bold=True, color=BLUE)
CONTACT = style("contact", 7.7, 12, color=MUTED)
SECTION = style("section", 9.5, 13, bold=True, color=BLUE)
SUBHEAD = style("subhead", 8.9, 12.5, bold=True)
BODY = style("body", 8.1, 12, color=NAVY)
SMALL = style("small", 7.6, 11.5, color=MUTED)


def para(text, kind=BODY):
    return Paragraph(text, kind)


def section(title):
    return [Spacer(1, 7), para(title.upper(), SECTION), Spacer(1, 3), HRFlowable(width="100%", thickness=.5, color=HAIR), Spacer(1, 6)]


def entry(title, meta, description):
    row = Table([
        [para(title, SUBHEAD), para(meta, SMALL)],
    ], colWidths=[325, 185], hAlign="LEFT")
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return KeepTogether([row, para(description, BODY), Spacer(1, 6)])


def add_footer(canvas, document):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(HAIR)
    canvas.line(42, 37, w - 42, 37)
    canvas.setFont("DejaVu", 6.8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 26, "Public portfolio CV  |  Updated November 2026")
    canvas.drawRightString(w - 42, 26, "Yakhrevan S  ·  1 / 1")
    canvas.restoreState()


def build():
    DEST.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(DEST), pagesize=A4, leftMargin=42, rightMargin=42,
        topMargin=35, bottomMargin=49, title="Yakhrevan S - Robotics Engineering CV",
        author="Yakhrevan S", subject="Public engineering portfolio CV",
    )
    story = [
        para("YAKHREVAN S", NAME),
        para("Mechatronics Engineer  |  Robotics, Embedded Systems &amp; Autonomous Software", ROLE),
        Spacer(1, 4),
        para(
            'Coimbatore, India  |  <link href="mailto:yakhrevan18@gmail.com" color="#1962bf">yakhrevan18@gmail.com</link>'
            '  |  <link href="https://github.com/Yakhrevan" color="#1962bf">github.com/Yakhrevan</link>'
            '  |  <link href="https://www.linkedin.com/in/yakhrevans" color="#1962bf">LinkedIn</link>',
            CONTACT,
        ),
        Spacer(1, 5),
        para(
            '<link href="https://yakhrevan.github.io/Yakhrevan-Portfolio/" color="#1962bf">Portfolio and interactive engineering studies</link>',
            CONTACT,
        ),
    ]

    story += section("Engineering profile")
    story += [para(
        "Mechatronics engineer working across STM32/ESP32 embedded development, robot sensors, motor control and robotics software. "
        "The public portfolio includes AI-assisted, inspectable browser simulations with reproducible software tests and explicit hardware-validation boundaries."
    )]

    story += section("Professional experience")
    story += [
        entry(
            "Junior Robotics Engineer (Hardware Team) · Goat Robotics",
            "Apr 2026 - Present",
            "Low-level C/C++ hardware development with STM32/ESP32, sensor integration, motor control and debugging communication interfaces including CAN, I2C and SPI."
        ),
        entry(
            "ROS R&amp;D Intern · Goat Robotics",
            "Aug 2025 - Feb 2026",
            "Worked on an industrial sorting AGV concept with STM32, sensors and actuators; explored ROS-based navigation and obstacle-avoidance integration."
        ),
    ]

    story += section("Selected engineering portfolio work")
    story += [
        entry(
            "PickBot · Mobile manipulator",
            "CAD + browser simulation",
            "Designed arm CAD; specified four mecanum wheels and four arm joints. Reviewed AI-assisted virtual IK, contact-gated pickup and wheel-RPM demonstration. "
            "<b>Evidence:</b> 8 passing software tests. Full chassis CAD and physical grasp validation remain pending."
        ),
        entry(
            "Autonomous Navigation Lab · P6",
            "Independent browser simulation",
            "Specified goal navigation, simulated LiDAR, obstacle replanning and mission export. AI-assisted implementation demonstrates A* and differential-drive model. "
            "<b>Evidence:</b> 10 passing software tests; no ROS 2/Nav2/Gazebo execution."
        ),
        entry(
            "Robot Control Center · P2",
            "Independent browser simulation",
            "Specified task dispatch, synthetic telemetry, fault handling and latched E-stop workflows. AI-assisted implementation provides interactive operator states. "
            "<b>Evidence:</b> 9 passing software tests; no real robot or safety-certified E-stop."
        ),
    ]

    story += section("Education and leadership")
    story += [
        para("<b>B.E. Mechatronics Engineering</b> · Sri Krishna College of Engineering and Technology, Coimbatore · CGPA 8.06 / 10", BODY),
        Spacer(1, 4),
        para("<b>Team ASTRA - Solar Kart:</b> Dashboard lead (2024-25) and mentor (2025-26); team participation in BSVC design evaluation and autocross awards (2024).", BODY),
    ]

    story += section("Technical focus")
    story += [
        para("<b>Programming:</b> Embedded C, C++, Python, TypeScript/JavaScript  |  <b>Robotics:</b> ROS/ROS 2 learning, robot kinematics, A*, LiDAR models, PID", BODY),
        Spacer(1, 3),
        para("<b>Hardware:</b> STM32, ESP32, sensors, motor control, CAN/I2C/SPI/UART  |  <b>Design:</b> SolidWorks, CAD, interactive simulation and test documentation", BODY),
    ]

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    print(f"Generated {DEST}")


if __name__ == "__main__":
    build()
