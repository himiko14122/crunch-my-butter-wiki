#!/usr/bin/env python3
import os
import re
from pathlib import Path
from collections import defaultdict
import json

CONTENT_DIR = "/Users/jinwei/Desktop/code/crunch-my-butter-wiki/content"
LOCALES = ["en", "th", "es", "pt"]

def count_words(text):
    """Count words in text, excluding markdown syntax"""
    if not text:
        return 0
    cleaned = re.sub(r'[#*_\[\]()`]', ' ', text)
    cleaned = re.sub(r'http[s]?://\S+', ' ', cleaned)
    words = [w for w in cleaned.split() if w.strip()]
    return len(words)

def analyze_mdx_structure_detailed(file_path):
    """Detailed analysis of MDX file structure"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return None

    # Remove frontmatter
    main_content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)

    # Split by lines
    lines = main_content.split('\n')

    structure = {
        'total_words': count_words(main_content),
        'sections': []
    }

    current_h2 = None
    current_h2_content = []
    current_h3 = None
    current_h3_content = []

    for line in lines:
        # Check for H2
        h2_match = re.match(r'^##\s+(.+)$', line)
        if h2_match:
            # Save previous H3 if exists
            if current_h3:
                content_text = '\n'.join(current_h3_content)
                structure['sections'][-1]['subsections'].append({
                    'title': current_h3,
                    'content': content_text,
                    'words': count_words(content_text),
                    'is_empty': count_words(content_text) == 0,
                    'line_count': len([l for l in current_h3_content if l.strip()])
                })
                current_h3 = None
                current_h3_content = []

            # Save previous H2 if exists
            if current_h2:
                content_text = '\n'.join(current_h2_content)
                structure['sections'][-1]['content'] = content_text
                structure['sections'][-1]['words'] = count_words(content_text)
                structure['sections'][-1]['is_empty'] = count_words(content_text) == 0

            # Start new H2
            current_h2 = h2_match.group(1)
            structure['sections'].append({
                'title': current_h2,
                'content': '',
                'words': 0,
                'is_empty': False,
                'subsections': []
            })
            current_h2_content = []
            continue

        # Check for H3
        h3_match = re.match(r'^###\s+(.+)$', line)
        if h3_match:
            # Save previous H3 if exists
            if current_h3:
                content_text = '\n'.join(current_h3_content)
                if structure['sections']:
                    structure['sections'][-1]['subsections'].append({
                        'title': current_h3,
                        'content': content_text,
                        'words': count_words(content_text),
                        'is_empty': count_words(content_text) == 0,
                        'line_count': len([l for l in current_h3_content if l.strip()])
                    })

            # Start new H3
            current_h3 = h3_match.group(1)
            current_h3_content = []
            continue

        # Add line to current content
        if current_h3:
            current_h3_content.append(line)
        elif current_h2:
            current_h2_content.append(line)

    # Save last H3 if exists
    if current_h3:
        content_text = '\n'.join(current_h3_content)
        if structure['sections']:
            structure['sections'][-1]['subsections'].append({
                'title': current_h3,
                'content': content_text,
                'words': count_words(content_text),
                'is_empty': count_words(content_text) == 0,
                'line_count': len([l for l in current_h3_content if l.strip()])
            })

    # Save last H2 if exists
    if current_h2:
        content_text = '\n'.join(current_h2_content)
        if structure['sections']:
            structure['sections'][-1]['content'] = content_text
            structure['sections'][-1]['words'] = count_words(content_text)
            structure['sections'][-1]['is_empty'] = count_words(content_text) == 0

    return structure

def analyze_empty_sections():
    """Find all empty H2/H3 sections across all locales"""
    results = {}

    for locale in LOCALES:
        locale_dir = os.path.join(CONTENT_DIR, locale)
        results[locale] = []

        for mdx_file in Path(locale_dir).rglob('*.mdx'):
            relative_path = mdx_file.relative_to(locale_dir)
            file_key = str(relative_path).replace('.mdx', '')

            structure = analyze_mdx_structure_detailed(mdx_file)
            if structure:
                empty_sections = []

                # Check H2 sections
                for section in structure['sections']:
                    if section['is_empty']:
                        empty_sections.append({
                            'type': 'H2',
                            'title': section['title'],
                            'words': section['words'],
                            'line_count': 0
                        })

                    # Check H3 subsections
                    for subsection in section['subsections']:
                        if subsection['is_empty']:
                            empty_sections.append({
                                'type': 'H3',
                                'title': subsection['title'],
                                'parent': section['title'],
                                'words': subsection['words'],
                                'line_count': subsection['line_count']
                            })

                if empty_sections:
                    results[locale].append({
                        'file': file_key,
                        'total_words': structure['total_words'],
                        'empty_sections': empty_sections,
                        'empty_count': len(empty_sections)
                    })

    return results

def compare_with_english(th_file_key, results):
    """Compare Thai file with English version"""
    # Find English version
    en_structure = None
    for mdx_file in Path(os.path.join(CONTENT_DIR, "en")).rglob('*.mdx'):
        relative_path = mdx_file.relative_to(os.path.join(CONTENT_DIR, "en"))
        file_key = str(relative_path).replace('.mdx', '')
        if file_key == th_file_key:
            en_structure = analyze_mdx_structure_detailed(mdx_file)
            break

    if not en_structure:
        return None

    # Find Thai version
    th_structure = None
    for mdx_file in Path(os.path.join(CONTENT_DIR, "th")).rglob('*.mdx'):
        relative_path = mdx_file.relative_to(os.path.join(CONTENT_DIR, "th"))
        file_key = str(relative_path).replace('.mdx', '')
        if file_key == th_file_key:
            th_structure = analyze_mdx_structure_detailed(mdx_file)
            break

    if not th_structure:
        return None

    comparison = {
        'en_total_words': en_structure['total_words'],
        'th_total_words': th_structure['total_words'],
        'word_ratio': th_structure['total_words'] / en_structure['total_words'] if en_structure['total_words'] > 0 else 0,
        'section_comparison': []
    }

    # Compare sections
    for en_section in en_structure['sections']:
        th_section = next((s for s in th_structure['sections'] if s['title'] == en_section['title']), None)
        if th_section:
            comparison['section_comparison'].append({
                'title': en_section['title'],
                'en_words': en_section['words'],
                'th_words': th_section['words'],
                'ratio': th_section['words'] / en_section['words'] if en_section['words'] > 0 else 0,
                'missing_content': th_section['words'] == 0 and en_section['words'] > 0
            })

    return comparison

def main():
    print("Analyzing empty sections across all locales...")
    empty_results = analyze_empty_sections()

    print("\n" + "="*80)
    print("EMPTY SECTIONS SUMMARY BY LOCALE")
    print("="*80)

    for locale in LOCALES:
        print(f"\n--- {locale.upper()} ---")
        if not empty_results[locale]:
            print("✓ No empty H2/H3 sections found")
        else:
            print(f"❌ Found {len(empty_results[locale])} files with empty sections:")
            for item in empty_results[locale]:
                print(f"\n  📄 {item['file']}")
                print(f"     Total words: {item['total_words']}")
                print(f"     Empty sections: {item['empty_count']}")
                for section in item['empty_sections'][:5]:  # Show first 5
                    indent = "      " if section['type'] == 'H3' else "    "
                    print(f"{indent}{section['type']}: {section['title']}")

    # Detailed analysis for Thai locale
    print("\n" + "="*80)
    print("DETAILED THAI FILE ANALYSIS")
    print("="*80)

    thai_files = [item['file'] for item in empty_results.get('th', [])]
    print(f"\nFound {len(thai_files)} Thai files with empty sections")

    # Get word count analysis
    print("\nWord count analysis for Thai files with empty sections:")
    thai_files_with_word_counts = []
    for file_key in thai_files:
        for mdx_file in Path(os.path.join(CONTENT_DIR, "th")).rglob('*.mdx'):
            relative_path = mdx_file.relative_to(os.path.join(CONTENT_DIR, "th"))
            current_file_key = str(relative_path).replace('.mdx', '')
            if current_file_key == file_key:
                structure = analyze_mdx_structure_detailed(mdx_file)
                if structure:
                    thai_files_with_word_counts.append({
                        'file': file_key,
                        'total_words': structure['total_words'],
                        'section_count': len(structure['sections']),
                        'subsection_count': sum(len(s['subsections']) for s in structure['sections'])
                    })
                break

    thai_files_with_word_counts.sort(key=lambda x: x['total_words'])

    print("\nTop 20 Thai files needing expansion (by word count):")
    for i, item in enumerate(thai_files_with_word_counts[:20]):
        print(f"{i+1:2d}. {item['file']}")
        print(f"    Words: {item['total_words']}, H2: {item['section_count']}, H3: {item['subsection_count']}")

    # Comparison with English
    print("\n" + "="*80)
    print("THAI vs ENGLISH COMPARISON (SAMPLE)")
    print("="*80)

    # Compare first 5 Thai files with their English counterparts
    for i, file_key in enumerate(thai_files_with_word_counts[:5]):
        comparison = compare_with_english(file_key['file'], empty_results)
        if comparison:
            print(f"\n{i+1}. {file_key['file']}")
            print(f"   EN words: {comparison['en_total_words']}")
            print(f"   TH words: {comparison['th_total_words']}")
            print(f"   Ratio: {comparison['word_ratio']:.1%}")

            missing_sections = [s for s in comparison['section_comparison'] if s['missing_content']]
            if missing_sections:
                print(f"   Missing content in {len(missing_sections)} sections:")
                for section in missing_sections[:3]:
                    print(f"      - {section['title']} (EN: {section['en_words']} words)")

    # Save detailed results
    output_file = "/Users/jinwei/Desktop/code/crunch-my-butter-wiki/detailed_content_analysis.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'empty_sections': empty_results,
            'thai_files_word_counts': thai_files_with_word_counts
        }, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Detailed analysis saved to {output_file}")

if __name__ == '__main__':
    main()