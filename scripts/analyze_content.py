#!/usr/bin/env python3
import os
import re
from pathlib import Path
from collections import defaultdict
import json

# Base content directory
CONTENT_DIR = "/Users/jinwei/Desktop/code/crunch-my-butter-wiki/content"
LOCALES = ["en", "th", "es", "pt"]

def count_words(text):
    """Count words in text, excluding markdown syntax"""
    if not text:
        return 0
    # Remove markdown syntax
    cleaned = re.sub(r'[#*_\[\]()`]', ' ', text)
    # Remove URLs
    cleaned = re.sub(r'http[s]?://\S+', ' ', cleaned)
    # Split and count
    words = [w for w in cleaned.split() if w.strip()]
    return len(words)

def parse_mdx_structure(file_path):
    """Parse MDX file to extract structure"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

    # Extract frontmatter (between --- markers)
    frontmatter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    frontmatter = frontmatter_match.group(1) if frontmatter_match else ""

    # Remove frontmatter from content
    main_content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)

    # Split by lines
    lines = main_content.split('\n')

    structure = {
        'intro': '',
        'sections': [],
        'total_words': 0,
        'frontmatter_words': count_words(frontmatter)
    }

    current_section = None
    current_content = []
    intro_lines = []

    for line in lines:
        # Check for H2
        h2_match = re.match(r'^##\s+(.+)$', line)
        if h2_match:
            # Save previous section
            if current_section:
                content_text = '\n'.join(current_content)
                structure['sections'].append({
                    'level': 2,
                    'title': current_section['title'],
                    'content': content_text,
                    'words': count_words(content_text),
                    'subsections': current_section['subsections']
                })
            # Start new section
            current_section = {'title': h2_match.group(1), 'subsections': []}
            current_content = []
            continue

        # Check for H3
        h3_match = re.match(r'^###\s+(.+)$', line)
        if h3_match:
            # Save previous subsection
            if current_content and current_section:
                content_text = '\n'.join(current_content)
                current_section['subsections'].append({
                    'title': current_section['subsections'][-1]['title'] if current_section['subsections'] else h3_match.group(1),
                    'content': content_text,
                    'words': count_words(content_text)
                })
                current_content = []
            # Start new subsection
            if current_section:
                current_section['subsections'].append({
                    'title': h3_match.group(1),
                    'content': '',
                    'words': 0
                })
            continue

        # Add line to current content
        current_content.append(line)

        # Add to intro if we're not in a section yet
        if current_section is None:
            intro_lines.append(line)

    # Save last section
    if current_section:
        content_text = '\n'.join(current_content)
        structure['sections'].append({
            'level': 2,
            'title': current_section['title'],
            'content': content_text,
            'words': count_words(content_text),
            'subsections': current_section['subsections']
        })

    structure['intro'] = '\n'.join(intro_lines)
    structure['intro_words'] = count_words(structure['intro'])
    structure['total_words'] = structure['intro_words'] + sum(s['words'] for s in structure['sections'])

    return structure

def analyze_all_files():
    """Analyze all MDX files across all locales"""
    results = {}

    for locale in LOCALES:
        locale_dir = os.path.join(CONTENT_DIR, locale)
        results[locale] = {}

        for mdx_file in Path(locale_dir).rglob('*.mdx'):
            relative_path = mdx_file.relative_to(locale_dir)
            file_key = str(relative_path).replace('.mdx', '')

            structure = parse_mdx_structure(mdx_file)
            if structure:
                results[locale][file_key] = structure

    return results

def generate_report(results):
    """Generate analysis report"""
    report = {
        'summary': {},
        'needs_expansion': {},
        'detailed': {}
    }

    for locale in LOCALES:
        locale_data = results[locale]
        needs_expansion = []

        for file_key, structure in locale_data.items():
            total_words = structure['total_words']

            # Check if file needs expansion (< 800 words for detailed content)
            if total_words < 800:
                needs_expansion.append({
                    'file': file_key,
                    'total_words': total_words,
                    'intro_words': structure['intro_words'],
                    'sections': structure['sections'],
                    'priority': 'high' if total_words < 400 else 'medium' if total_words < 600 else 'low'
                })

            # Store detailed info
            report['detailed'][file_key] = {
                'locale': locale,
                'total_words': total_words,
                'intro_words': structure['intro_words'],
                'frontmatter_words': structure['frontmatter_words'],
                'sections': structure['sections'],
                'needs_expansion': total_words < 800,
                'section_details': []
            }

            # Add detailed section analysis
            for section in structure['sections']:
                section_info = {
                    'title': section['title'],
                    'words': section['words'],
                    'has_subsections': len(section['subsections']) > 0,
                    'subsections': [],
                    'needs_content': section['words'] < 100  # Section needs more content if < 100 words
                }

                for sub in section['subsections']:
                    section_info['subsections'].append({
                        'title': sub['title'],
                        'words': sub['words'],
                        'needs_content': sub['words'] < 50  # Subsection needs more content if < 50 words
                    })

                report['detailed'][file_key]['section_details'].append(section_info)

        # Sort by word count (ascending) for prioritization
        needs_expansion.sort(key=lambda x: x['total_words'])
        report['needs_expansion'][locale] = needs_expansion
        report['summary'][locale] = {
            'total_files': len(locale_data),
            'needs_expansion_count': len(needs_expansion)
        }

    return report

def main():
    print("Analyzing MDX files...")
    results = analyze_all_files()
    report = generate_report(results)

    # Save report to JSON
    output_file = "/Users/jinwei/Desktop/code/crunch-my-butter-wiki/content_analysis_report.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Analysis complete! Report saved to {output_file}")

    # Print summary
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    for locale in LOCALES:
        total = report['summary'][locale]['total_files']
        needs = report['summary'][locale]['needs_expansion_count']
        percentage = (needs / total * 100) if total > 0 else 0
        print(f"{locale}: {needs}/{total} files need expansion (< 800 words) - {percentage:.1f}%")

    print("\n" + "="*50)
    print("TOP 15 FILES NEEDING EXPANSION (ALL LOCALES)")
    print("="*50)

    all_files = []
    for locale in LOCALES:
        for item in report['needs_expansion'][locale]:
            all_files.append({
                'locale': locale,
                'file': item['file'],
                'words': item['total_words'],
                'priority': item['priority']
            })

    all_files.sort(key=lambda x: x['words'])
    for i, item in enumerate(all_files[:15]):
        print(f"{i+1}. [{item['locale']}] {item['file']} - {item['words']} words ({item['priority']})")

    # Print detailed analysis of files needing expansion
    print("\n" + "="*50)
    print("DETAILED ANALYSIS OF FILES NEEDING EXPANSION")
    print("="*50)

    for locale in LOCALES:
        if report['needs_expansion'][locale]:
            print(f"\n--- {locale.upper()} ---")
            for item in report['needs_expansion'][locale][:5]:  # Show top 5 per locale
                file_key = item['file']
                details = report['detailed'][file_key]
                print(f"\n📄 {file_key}")
                print(f"   Total: {item['total_words']} words | Intro: {item['intro_words']} words | Priority: {item['priority']}")

                # Analyze sections
                empty_sections = []
                low_content_sections = []

                for section in details['section_details']:
                    if section['words'] == 0:
                        empty_sections.append(section['title'])
                    elif section['words'] < 50:
                        low_content_sections.append(f"{section['title']} ({section['words']} words)")

                    # Check subsections
                    for sub in section['subsections']:
                        if sub['words'] == 0:
                            empty_sections.append(f"  → {sub['title']}")
                        elif sub['words'] < 30:
                            low_content_sections.append(f"  → {sub['title']} ({sub['words']} words)")

                if empty_sections:
                    print(f"   ❌ Empty sections: {', '.join(empty_sections)}")
                if low_content_sections:
                    print(f"   ⚠️  Low content sections: {', '.join(low_content_sections)}")

                # Provide expansion suggestions
                print(f"   💡 Expansion suggestions:")
                if item['intro_words'] < 100:
                    print(f"      - Add more descriptive intro (currently {item['intro_words']} words)")
                for section in details['section_details']:
                    if section['words'] < 50 and section['words'] > 0:
                        print(f"      - Expand '{section['title']}' section with detailed explanation")
                    elif section['words'] == 0:
                        print(f"      - Add content to '{section['title']}' section")

if __name__ == '__main__':
    main()