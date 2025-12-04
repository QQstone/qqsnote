import os
import re
import yaml
from collections import defaultdict

def parse_front_matter(file_path):
    """解析 Markdown 文件的 Front Matter"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 Front Matter
    front_matter_match = re.match(r'^---\s*(.*?)\s*---\s*', content, re.DOTALL)
    if not front_matter_match:
        return None
    
    front_matter_content = front_matter_match.group(1)
    
    try:
        front_matter = yaml.safe_load(front_matter_content)
        return front_matter
    except yaml.YAMLError:
        return None

def analyze_categories():
    posts_dir = r'd:\Workspace\QQsNote\source\_posts'
    
    # 获取所有 .md 文件
    md_files = [f for f in os.listdir(posts_dir) if f.endswith('.md')]
    
    # 存储需要修改的文章
    missing_categories = []  # 缺失 categories
    unclear_categories = []  # 不严谨的 categories
    
    # 统计现有的 categories
    existing_categories = defaultdict(int)
    
    for md_file in md_files:
        file_path = os.path.join(posts_dir, md_file)
        front_matter = parse_front_matter(file_path)
        
        if front_matter:
            title = front_matter.get('title', md_file)
            categories = front_matter.get('categories', [])
            tags = front_matter.get('tags', [])
            
            # 处理字符串类型的 categories
            if isinstance(categories, str):
                categories = [categories]
            
            # 统计现有 categories
            for category in categories:
                existing_categories[category] += 1
            
            # 检查缺失的 categories
            if not categories or len(categories) == 0:
                missing_categories.append((title, tags, md_file))
            
            # 检查不严谨的 categories
            # 这里定义一些不严谨的情况：
            # 1. 只有一个通用的分类（如 "技术"）
            # 2. 分类名称模糊不清
            # 3. 分类与标签重复
            elif len(categories) == 1:
                category = categories[0]
                # 检查是否是模糊分类
                if category.lower() in ['技术', '编程', '开发', '学习', '笔记', 'none', '']:
                    unclear_categories.append((title, categories, tags, md_file))
                # 检查分类与标签是否重复
                elif category in tags:
                    unclear_categories.append((title, categories, tags, md_file))
            
            # 检查是否有多个不相关的分类
            elif len(categories) > 2:
                unclear_categories.append((title, categories, tags, md_file))
        else:
            # 解析失败的文件
            missing_categories.append((md_file, [], md_file))
    
    return missing_categories, unclear_categories, existing_categories

def main():
    missing_categories, unclear_categories, existing_categories = analyze_categories()
    
    print("=== 文章分类分析报告 ===")
    print()
    
    # 显示现有分类统计
    print("现有分类统计：")
    for category, count in sorted(existing_categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {category}: {count} 篇")
    print()
    
    # 显示缺失分类的文章
    print("=== 缺失分类的文章 ===")
    print("文章标题 | Tags | 文件名")
    print("--- | --- | ---")
    for title, tags, filename in missing_categories:
        tags_str = ', '.join(tags) if isinstance(tags, list) else str(tags)
        print(f"{title} | {tags_str} | {filename}")
    print()
    
    # 显示分类不严谨的文章
    print("=== 分类不严谨的文章 ===")
    print("文章标题 | 当前分类 | Tags | 文件名")
    print("--- | --- | --- | ---")
    for title, categories, tags, filename in unclear_categories:
        categories_str = ', '.join(categories) if isinstance(categories, list) else str(categories)
        tags_str = ', '.join(tags) if isinstance(tags, list) else str(tags)
        print(f"{title} | {categories_str} | {tags_str} | {filename}")

if __name__ == '__main__':
    main()