import re
import json

# Initialize an empty list to store the last words
last_words = []

# Regular expression to match a word with no punctuation
word_pattern = re.compile(r'^\w+$')

# Open the file and read line by line
with open('words.txt', 'r') as file:
    for line in file:
        # Split the line by spaces
        parts = line.split()
        
        # Get the last word
        last_word = parts[-1]
        
        # Check if the last word matches the pattern
        if word_pattern.match(last_word):
            # Append the last word to the list
            last_words.append(last_word)

# Define the output JSON structure
output_json = {
    "last_words": last_words
}

# Write the list of last words to a JSON file
with open('output.json', 'w') as json_file:
    json.dump(output_json, json_file, indent=4)

print("Words have been saved to output.json")
