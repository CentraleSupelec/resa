import os
import semver

def increment_patch():
    with open('version.txt', 'r') as file:
        current_version = file.read().strip()
    new_version = str(semver.bump_patch(current_version))
    with open('version.txt', 'w') as file:
        file.write(new_version)

def increment_minor():
    with open('version.txt', 'r') as file:
        current_version = file.read().strip()
    new_version = str(semver.bump_minor(current_version))
    with open('version.txt', 'w') as file:
        file.write(new_version)

def increment_major():
    with open('version.txt', 'r') as file:
        current_version = file.read().strip()
    new_version = str(semver.bump_major(current_version))
    with open('version.txt', 'w') as file:
        file.write(new_version)

# Increment version depending on commit message
commit_message = os.environ.get('CI_COMMIT_MESSAGE', '')
print(commit_message)

if '[patch]' in commit_message:
    increment_patch()
elif '[minor]' in commit_message:
    increment_minor()
elif '[major]' in commit_message:
    increment_major()
