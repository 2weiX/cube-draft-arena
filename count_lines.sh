
#!/bin/bash

# Find all files in the src directory
find src -type f | while read -r file; do
    # Count lines in the file
    lines=$(wc -l < "$file")
    echo "$file: $lines lines"
done | sort -t: -k2 -n -r
