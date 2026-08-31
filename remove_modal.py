import re

file_path = "client/src/app/profile/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

start_marker = "{/* ── 6. Edit Profile Modal (Includes Local & ImgBB Upload) ── */}"
end_marker = "</AnimatePresence>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx:]
    with open(file_path, "w") as f:
        f.write(new_content)
    print("Modal successfully removed!")
else:
    print("Could not find markers.")
