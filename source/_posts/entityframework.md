---
title: Entity Framework
date: 2020-06-15 16:39:32
tags:
- .Net
---
> EntirtyFramework框架是一个轻量级的可扩展版本的流行实体框架数据访问技术,ORM工具(Object Relational Mapping 对象关系映射)

EF有三种使用场景，1. 从数据库生成Class(DB First)，2.由实体类生成数据库表结构(Code First)，3.  通过数据库可视化设计器设计数据库，同时生成实体类(Model First)。
#### 实体类型
```
class MyContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditEntry>();
    }
}

public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    public List<Post> Posts { get; set; }
}
// 从模型中排除的类型
[NotMapped]
public class BlogMetadata
{
    public DateTime LoadedFromDatabase { get; set; }
}
```
> 按照约定，每个实体类型将设置为映射到与公开实体的 DbSet 属性同名的数据库表。 如果给定实体不存在 DbSet，则使用类名称。或使用注解 [ Table("tableName") ]
#### 实体属性
```
public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    //从模型中排除的属性
    [NotMapped]
    public DateTime LoadedFromDatabase { get; set; }
}
```
列注解：
+ 列名 [ Column("blog_id") ]
+ 数据类型 [Column(TypeName = "varchar(200)")]
+ 校验  [ MaxLength(500) ] [ Required ]       

#### 键
主键
```
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .HasKey(b => b.BlogId)
        .HasName("PrimaryKey_BlogId");
}
```
Alternative Key
```
class MyContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Blog)
            .WithMany(b => b.Posts)
            .HasForeignKey(p => p.BlogUrl)
            .HasPrincipalKey(b => b.Url);
    }
}
```
#### 策略维护 多对多关系
[官网Doc](https://docs.microsoft.com/zh-cn/ef/core/modeling/relationships#other-relationship-patterns)<br>
> 目前尚不支持多对多关系，没有实体类来表示联接表。 但是，您可以通过包含联接表的实体类并映射两个不同的一对多关系，来表示多对多关系。
```
class MyContext : DbContext
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PostTag>()
            .HasKey(t => new { t.PostId, t.TagId });

        modelBuilder.Entity<PostTag>()
            .HasOne(pt => pt.Post)
            .WithMany(p => p.PostTags)
            .HasForeignKey(pt => pt.PostId);

        modelBuilder.Entity<PostTag>()
            .HasOne(pt => pt.Tag)
            .WithMany(t => t.PostTags)
            .HasForeignKey(pt => pt.TagId);
    }
}

public class Post
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }

    public List<PostTag> PostTags { get; set; }
}

public class Tag
{
    public string TagId { get; set; }

    public List<PostTag> PostTags { get; set; }
}

public class PostTag
{
    public int PostId { get; set; }
    public Post Post { get; set; }

    public string TagId { get; set; }
    public Tag Tag { get; set; }
}
```
#### 一对多
```
// 博客
public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    public List<Post> Posts { get; set; }
}
// 文章
public class Post
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }

    public int BlogId { get; set; }
    public Blog Blog { get; set; }
}
```
+ Post是依赖实体
+ Blog是主体实体
+ Blog.BlogId是主体键（在本例中为主密钥，而不是备用密钥）
+ Post.BlogId为外键
+ Post.Blog是一个引用导航属性
+ Blog.Posts是集合导航属性
+ Post.Blog是的反向导航属性 
关联关系
```
class MyContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .HasOne<Blog>()
            .WithMany()
            .HasForeignKey(p => p.BlogId);
    }
}
```
#### 关联查询
```
public async Task<IActionResult> Details(string code)
{
    if (code == null)
    {
        return NotFound();
    }
    // Blog <>--- ReferenceMap ---<> Theme
    var Blog = await _context. Blogs
                    .Include(blog => blog.ReferenceMap)
                    .ThenInclude(map => map.Theme)
                    .FirstOrDefaultAsync(m => m.Code == code);
    if (Blog == null)
    {
        return NotFound();
    }

    return View(Blog);
}
```
#### 关联存储
[here](https://docs.microsoft.com/zh-cn/ef/core/saving/related-data)

#### select
```
 var studentsWithSameName = context.Students
                                      .Where(s => s.FirstName == GetName())
                                      .ToList();
```