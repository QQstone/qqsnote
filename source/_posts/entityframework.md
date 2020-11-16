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
#### 一对一
```
public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }

    public BlogImage BlogImage { get; set; }
}

public class BlogImage
{
    public int BlogImageId { get; set; }
    public byte[] Image { get; set; }
    public string Caption { get; set; }

    public int BlogId { get; set; }
    public Blog Blog { get; set; }
}
```
配置关系时HasForeignKey必须指定实体类型，这一点区别于上面的书写方式
```
modelBuilder.Entity<Blog>()
    .HasOne(b => b.BlogImage)
    .WithOne(i => i.Blog)
    .HasForeignKey<BlogImage>(b => b.BlogForeignKey);
```
#### 关联关系
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
关联关系有Reqiuired和Optional之分，前者的情况下，对主体实体的删除会导致依赖实体被级联删除，而对于后者，默认不被配置为级联删除而将外键属性置为null
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
向导航属性（blog.Posts）中添加新实体，EF自动发现关联实体并将其插入数据库
```
await using (var context = new BloggingContext())
{
    var blog = await context.Blogs.Include(b => b.Posts).FirstAsync();
    var post = new Post { Title = "Intro to EF Core" };

    blog.Posts.Add(post);
    await context.SaveChangesAsync();
}
```
自动更改外键列
```
await using (var context = new BloggingContext())
{
    var blog = new Blog { Url = "http://blogs.msdn.com/visualstudio" };
    var post = await context.Posts.FirstAsync();

    post.Blog = blog;
    await context.SaveChangesAsync();
}
```
上面的代码没有显式操作外键post.blogId，但EF会自动更新，并且将所需的新实体blog插入数据库
#### CRUD
```
// create
context.Add(new Student{
    FirstName="Jack",
    SurName="Ma"
});
context.SaveChanges();
// select
var MaYun = context.Students
            .Where(s => s.FirstName == GetName()).ToList();
// update
MaYun.Age=8;
context.SaveChanges()
// delete
context.Remove(MaYun);
context.SaveChanges()
```
一般在web应用中使用异步
```
// create
context.Add(new Student{
    FirstName="Jack",
    SurName="Ma"
});
context.SaveChangesAsync();
// select
var MaYun = context.Students
            .Where(s => s.FirstName == GetName()).ToListAsync();
// update
MaYun.Age=8;
context.SaveChangesAsync()
// delete
context.Remove(MaYun);
context.SaveChangesAsync()
```
#### DBcontext和connectionstring
startup.cs
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<BloggingContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DBConnection")));
}
```
#### 重连
数据库如SQL Server的provider程序，可以识别可重试（retry）的异常类型
```
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<PicnicContext>(
        options => options.UseSqlServer(
            Configuration.GetConnectionString("DBConnection"),
            providerOptions => providerOptions.EnableRetryOnFailure()));
}
```
#### 事务
额外的，[Transaction commit failure](https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency)

对于多项实体操作(CRUD)后SaveChanges，SaveChanges是事务性的，意味着前面所有操作成功或失败，而不会产生部分成功部分失败

#### Lazy load
访问导航属性（外键）时再次查询数据库
```
using (var dbContext = new CategoryEntities())
{
    dbContext.Configuration.LazyLoadingEnabled = true; // 默认是true，针对导航属性
        var categoryList = dbContext.Set<Category>().Where(p => p.CategoryId == 3);
        // 只会在数据库里面查询Category表，不会查询ProductDetail表
        foreach(var category in categoryList)
        {
            Console.WriteLine("CategoryId:"+category.CategoryId+ ",CategoryName:"+category.CategoryName);
            // 这时才会去数据库查询ProductDetail表
            foreach (var product in category.ProductDetails)
            {
                Console.WriteLine("ProductName:"+product.ProductName);
            }
        }
}
```
不再继续查询
```
using (var dbContext = new CategoryEntities())
{
    dbContext.Configuration.LazyLoadingEnabled = false; // 不延迟加载,不会再次查询了
    var categoryList = dbContext.Set<Category>().Where(p => p.CategoryId == 3);
    // 只会在数据库里面查询Category表，不会查询ProductDetail表
    foreach (var category in categoryList)
    {
        Console.WriteLine("CategoryId:" + category.CategoryId + ",CategoryName:" + category.CategoryName);
        // 这时不会去数据库查询了，所以用户全是空的
        foreach (var product in category.ProductDetails)
        {
            Console.WriteLine("ProductName:" + product.ProductName);
        }
    }
}
```
一次性完成查询
```
// 显示加载
using (var dbContext = new CategoryEntities())
{
    // 不延迟加载，指定Include，一次性加载主表和从表的所有数据
    var categoryList = dbContext.Set<Category>().Include("ProductDetails").Where(p => p.CategoryId == 3);
    foreach (var category in categoryList)
    {
        Console.WriteLine("CategoryId:" + category.CategoryId + ",CategoryName:" + category.CategoryName);
        // 不会再查询
        foreach (var product in category.ProductDetails)
        {
            Console.WriteLine("ProductName:" + product.ProductName);
        }
    }
}
```
> issue: Data is Null. This method or property cannot be called on Null values.
> 
一个很简单的出错原因是model的基本类型（非对象，不能设置为null）如int，Guid等的属性，其对应的table field为null。
应以int?,Guid?作为属性类型以支持null
#### Parent/Child
对应于使用id，parentid组织的父子关系表，常见的组织机构树，职能头衔树等
```
public class Group
{
    public Guid ID { get; set; }
    public string Name { get; set; }
    public Guid? ParentID { get; set; }
    public Group Parent { get; set; }
    
    public ICollection<Group> Children { get; } = new List<Group>();
}
```
查询子树
```
var data = (await _context.Group.ToListAsync())
            .Where(g => g.ID == new Guid(groupId))
            .ToList();
```
#### Hierarchy Data
参考[Using SQL Server HierarchyId with Entity Framework Core](https://www.meziantou.net/using-hierarchyid-with-entity-framework-core.htm)
package: 
+ Microsoft.EntityFrameworkCore.SqlServer
+ EntityFrameworkCore.SqlServer.HierarchyId
数据库上下文需要配置启用HierarchyId，否则出现下述异常
> The property is of type 'HierarchyId' which is not supported by current database provider. Either change the property CLR type or ignore the property using the '[NotMapped]' attribute or by using 'EntityTypeBuilder.Ignore' in 'OnModelCreating'.

在Startup.cs,配置启用HierarchyId
```
 public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DataContext"), conf=>
            {
                conf.UseHierarchyId();
            }
        ));
    ...
}
```
model定义
```
public class Group
{
    public Guid ID { get; set; }
    public string Name { get; set; }
    public HierarchyId GroupLevel { get; set; }
    
    public ICollection<Group> Children { get; } = new List<Group>();
}
```
查询linq
```
public async Task<List<Group>> GetChildrenByGroupIDAsync(Guid groupID)
{
    Group self = await _context.Groups.FindAsync(groupID);
    List<Group> groups = await _context.Groups
        .Where(g => g.GroupLevel.IsDescendantOf(self.GroupLevel))
        .ToListAsync();

    return groups; //.FindAll(g => g.ID != groupID);
}
```
其他查询见文章{% post_link sqlserver SQLServer %}

#### Transient Error
> Exception: An exception has been raised that is likely due to a transient failure. Consider enabling transient error resiliency by adding 'EnableRetryOnFailure()' to the 'UseSqlServer' call.

见[StackOverflow: Getting transient errors when making calls against Azure SQL Database from Azure Function](https://stackoverflow.com/questions/54186894/getting-transient-errors-when-making-calls-against-azure-sql-database-from-azure)

数据库系统偶现Transient Error，这种暂时性错误的根本原因（underlying cause）很快就能自行解决，且在错误抛出时，.net程序会抛出上述的SqlException，为了处理这些错误，可应用程序代码中实现重试逻辑，而不是以应用程序错误的形式呈现给用户。
在Startup.cs,配置启用RetryOnFailure
```
 public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DataContext"), conf=>
            {
                conf.EnableRetryOnFailure();
            }
        ));
    ...
}
```
但是这里有个bug [System.ArgumentException thrown when EnableRetryOnFailure is used.](https://github.com/efcore/EFCore.SqlServer.HierarchyId/issues/24)