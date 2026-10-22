#!/usr/bin/env python3
"""
Resume PDF Generator for Kartik Goyal
Generates a clean, ATS-friendly, single-page PDF with precise vector layout.
"""

def escape_pdf(text: str) -> str:
    """Escapes parentheses and backslashes for PDF string literals."""
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def generate_pdf(output_path="resume.pdf", data=None):
    if data is None:
        data = {
            "name": "KARTIK GOYAL",
            "title": "Full-Stack & AI Developer",
            "location": "Gurugram, India",
            "email": "goyalkartik208@gmail.com",
            "github": "github.com/kartikgoyal",
            "linkedin": "linkedin.com/in/kartikgoyal",
            "summary": [
                "Passionate engineer specializing in backend systems, automated real-time alerts, AI-driven tools, and",
                "mobile-responsive web applications. Experienced in async queues, WhatsApp/Twilio webhooks, and React/Next.js."
            ],
            "projects": [
                {
                    "title": "1. SocietyPool - AI Hyperlocal Group-Buying Platform [Hackathon Winner] (03/2026)",
                    "bullets": [
                        "- Built dynamic step-function tier pricing algorithms unlocking up to 30% group discounts.",
                        "- Integrated OpenAI API Society Copilot for instant community booking drafts and WhatsApp announcements.",
                        "- Tech: Next.js, OpenAI API, Node.js, WhatsApp Automation"
                    ]
                },
                {
                    "title": "2. MedAlert - Automated Healthcare Escalation System (02/2026)",
                    "bullets": [
                        "- Architected async timer scheduler managing non-blocking patient dose intake windows.",
                        "- Automated WhatsApp Caretaker Escalation pipeline triggering in < 2 minutes if medicine unlogged.",
                        "- Tech: JavaScript, Node.js, WhatsApp API, Twilio, Async Timers"
                    ]
                },
                {
                    "title": "3. Full-Stack E-Commerce Platform (01/2026)",
                    "bullets": [
                        "- Production storefront with reactive cart state management, checkout flows, and inventory decrements.",
                        "- Implemented JWT token authentication with bcrypt hashing and RBAC admin controls.",
                        "- Tech: React, Node.js, Express, MongoDB, Tailwind CSS"
                    ]
                }
            ],
            "skills": [
                "Languages & Frontend: JavaScript (ES2026), TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS",
                "Backend & Database: Node.js, Express.js, MongoDB, PostgreSQL, RESTful APIs, Redis",
                "APIs & Automation: OpenAI API, Twilio API, WhatsApp Cloud API, Async Timers, Webhooks",
                "DevOps & Tools: Git, GitHub Actions, Vercel, Netlify, Docker, Postman, Linux CLI"
            ],
            "education": [
                "B.E. in Computer Science & Engineering (2026 - 2030) - First Class with Distinction"
            ]
        }

    stream_lines = []
    stream_lines.append("BT")
    
    # Header Name
    stream_lines.append("/F1 20 Tf")
    stream_lines.append("50 745 Td")
    stream_lines.append(f"({escape_pdf(data['name'])}) Tj")
    
    # Subtitle / Contact Line 1
    stream_lines.append("/F2 10.5 Tf")
    stream_lines.append("0 -17 Td")
    contact_1 = f"{data['title']} | {data['location']} | {data['email']}"
    stream_lines.append(f"({escape_pdf(contact_1)}) Tj")
    
    # Subtitle / Contact Line 2
    stream_lines.append("/F2 9.5 Tf")
    stream_lines.append("0 -13 Td")
    contact_2 = f"{data['github']} | {data['linkedin']} | Specializing in AI Retrieval & Agent Systems"
    stream_lines.append(f"({escape_pdf(contact_2)}) Tj")
    
    # Section: Summary
    stream_lines.append("0 -23 Td")
    stream_lines.append("/F1 11.5 Tf")
    stream_lines.append("(PROFESSIONAL SUMMARY) Tj")
    stream_lines.append("/F2 9 Tf")
    for s_line in data["summary"]:
        stream_lines.append("0 -13 Td")
        stream_lines.append(f"({escape_pdf(s_line)}) Tj")
        
    # Section: Projects
    stream_lines.append("0 -21 Td")
    stream_lines.append("/F1 11.5 Tf")
    stream_lines.append("(FEATURED 2026 PROJECTS) Tj")
    for proj in data["projects"]:
        stream_lines.append("/F1 9.5 Tf")
        stream_lines.append("0 -15 Td")
        stream_lines.append(f"({escape_pdf(proj['title'])}) Tj")
        stream_lines.append("/F2 9 Tf")
        for bullet in proj["bullets"]:
            stream_lines.append("0 -12 Td")
            stream_lines.append(f"({escape_pdf(bullet)}) Tj")
            
    # Section: Skills
    stream_lines.append("0 -21 Td")
    stream_lines.append("/F1 11.5 Tf")
    stream_lines.append("(TECHNICAL SKILLS) Tj")
    stream_lines.append("/F2 9 Tf")
    for sk in data["skills"]:
        stream_lines.append("0 -13 Td")
        stream_lines.append(f"({escape_pdf(sk)}) Tj")
        
    # Section: Education
    stream_lines.append("0 -21 Td")
    stream_lines.append("/F1 11.5 Tf")
    stream_lines.append("(EDUCATION) Tj")
    stream_lines.append("/F2 9 Tf")
    for edu in data["education"]:
        stream_lines.append("0 -13 Td")
        stream_lines.append(f"({escape_pdf(edu)}) Tj")
        
    stream_lines.append("ET")
    
    stream_content = "\n".join(stream_lines).encode("latin-1")
    
    objects = []
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    objects.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>")
    # 4: Stream Contents
    objects.append(f"<< /Length {len(stream_content)} >>\nstream\n".encode("latin-1") + stream_content + b"\nendstream")
    # 5: Helvetica-Bold
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    # 6: Helvetica
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    
    pdf_bytes = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, obj in enumerate(objects, 1):
        offsets.append(len(pdf_bytes))
        pdf_bytes.extend(f"{i} 0 obj\n".encode("latin-1"))
        pdf_bytes.extend(obj)
        pdf_bytes.extend(b"\nendobj\n")
        
    xref_pos = len(pdf_bytes)
    pdf_bytes.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
    pdf_bytes.extend(b"0000000000 65535 f \n")
    for off in offsets:
        pdf_bytes.extend(f"{off:010d} 00000 n \n".encode("latin-1"))
    pdf_bytes.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode("latin-1"))
    
    with open(output_path, "wb") as f:
        f.write(pdf_bytes)
    print(f"Generated {output_path} successfully ({len(pdf_bytes)} bytes)")

if __name__ == "__main__":
    generate_pdf()
