from datetime import datetime
import re

def parse_cin_text(cin_text):
    cin_data = {}
    lines = cin_text.replace("\n\n","\n").split('\n')
    nom = None
    prenom = None
    for i, line in enumerate(lines):
        line = line.strip()
        if ("Nom" in line or "LES" in line) and i + 1 < len(lines):
            nom = lines[i + 1].strip()
        if ("Prenant)" in line or "Prénoms" in line or "Drenomis)" in line) and i + 1 < len(lines):
            prenom_line = lines[i + 1].strip()
            prenom = prenom_line.replace("pu ", "").strip()
        
        if "Enter" in line or "Nétier" in line or "Né(e) le" in line:
            date_match = re.search(r'(\d{1,2})\s+(\w+)\s+(\d{4})', line)
            if date_match:
                day, month, year = date_match.groups()
                month_mapping = {
                    'janvier': 'January', 'février': 'February', 'mars': 'March', 'avril': 'April',
                    'mai': 'May', 'juin': 'June', 'juillet': 'July', 'juilitot': 'July',
                    'août': 'August', 'septembre': 'September', 'octobre': 'October',
                    'novembre': 'November', 'décembre': 'December'
                }
                month = month_mapping.get(month.lower(), month)
                date_str = f"{day} {month} {year}"
                try:
                    cin_data['birth_date'] = datetime.strptime(date_str, "%d %B %Y").date()
                except ValueError:
                    cin_data['birth_date'] = None
        
        if "cin:" in line.lower() or "can" in line.lower():
            cin_digits = ''.join(filter(str.isdigit, line))
            if len(cin_digits) >= 12:
                cin_data['cin_number'] = cin_digits[:12]
            else:
                cin_data['cin_number'] = ''
    if nom and prenom:
        cin_data['name'] = f"{nom} {prenom}"
    elif nom:
        cin_data['name'] = nom
    else:
        cin_data['name'] = "Unknown"
    
    return cin_data
