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
使用数据库上下文修改模型(包括新增和移除)，并执行SaveChanges，相当于commit
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
<span style="color:#f50;font-weight:bold">Caution!</span> 在对DbContext的多次操作中，如果前面一次SaveChanges出错，如Add操作违反唯一约束而失败，需要将该实体类实例从DbContext中移除(或修正)，否则出错的命令会一直在提交队列中，反复报错
```
try
{
    _context.Add(newBlog);
    await _context.SaveChangesAsync();
}
catch (Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
{
    // TODO the result description is not properly rigorous.
    if (null != dbEx.InnerException
        && dbEx.InnerException.Message.Contains("constraint"))
    {
        System.Console.WriteLine("Blog exists;");
    }
    else
    {
        // other error handle
    }
    _context.Remove(newBlog);
}
```
DBContext.Add成功后 若主键id使用数据库策略生成 Add成功后即可从对象中取到
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
<del>但是这里有个bug [System.ArgumentException thrown when EnableRetryOnFailure is used.](https://github.com/efcore/EFCore.SqlServer.HierarchyId/issues/24)</del> 该bug已在dotNet 5版本修复
#### 分页
```
List<customers> _customers = (from a in db.customers select a).ToList();
var _dataToWebPage = _customers.Skip(50).Take(50);
```
[StackOverflow:C# entity framework pagination](https://stackoverflow.com/questions/10145815/c-sharp-entity-framework-pagination)

#### ORM注意事项
[EF O/RM 注意事项](https://docs.microsoft.com/zh-cn/ef/core/#ef-orm-considerations)

#### 日志
startup.cs
```
services.AddDbContext<MyDBContext>(options => {
    options.UseSqlServer(Configuration.GetConnectionString("MyDBContext"), conf => {
        conf.UseHierarchyId();
        conf.EnableRetryOnFailure();
    });
    options.LogTo(System.Console.WriteLine);
});
```
[Docs:简单的日志记录](https://docs.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/simple-logging)
日志委托和日志级别：
```
options.LogTo(Console.WriteLine, LogLevel.Information;
```
#### Exception：this sqltransaction has completed it is no longer usable
```
[HttpPost]
[Route("api/[controller]/create")]
public async Task<Result> Create([FromBody] QModel model){
    ...
    try{
        _context.Add(model);
        await _context.SaveChangesAsync();
    }catch(Exception ex){
        // ...
    }
}
```
如上一个insert数据的接口，在有限的并发条件下（也就是for循环几条请求），个别错误数据可以造成其他正常数据插入失败
报 this sqltransaction has completed it is no longer usable 以及 zombie check等解释
查了2天资料未能解决
次日反思 问题或许出在多条线程同时向数据库上下文中推数据（即_context.Add）其中一个错误数据的出错，事务自动回滚，导致了其他线程中访问该事务已不可用。
此处使用_context.AddAsync方法可以解决
即，该问题就是个ef方法的线程安全的问题，可见[StackOverflow: AddAsync vs Add](https://stackoverflow.com/questions/47135262/addasync-vs-add-in-ef-core)
那么我一个需求要添加user并为其分配新的group，一个事务里两个add操作怎么办呢，另起一小节：

#### 一个事务多个操作的线程安全
其实在官方文档最初的概述中，强调了DbContext的线程不安全 见[Microsoft Docs: DBContext Lifetime](https://docs.microsoft.com/zh-cn/ef/core/dbcontext-configuration/#the-dbcontext-lifetime)
> DbContext 不是线程安全的。 不要在线程之间共享上下文。 请确保在继续使用上下文实例之前，等待所有异步调用。

关于以事务作为上下文生命周期的配置, 见[StackOverflow:Configuring Dbcontext as Transient](https://stackoverflow.com/questions/41923804/configuring-dbcontext-as-transient) <span style="color:#f00;font-weight:bold">然而!</span>经实践同一接口的并发测试 仍然会出现this sqltransaction has completed it is no longer usable的异常
依赖注入的DBContext
在Startup的ConfigureServices中注册MyDBContext服务提供程序：
```
services.AddDbContext<MyDBContext>(
    options => options.UseSqlServer(Configuration.GetConnectionString("MyDBContext"),
                                conf => { conf.UseHierarchyId();
                                    conf.EnableRetryOnFailure();
                                }), ServiceLifetime.Transient);
```
注入DBContext:
```
public class GroupsController : ControllerBase
{
    private readonly MyDBContext _context;
    private IGroupTreeService _groupTreeService;

    public GroupsController(MyDBContext context, IGroupTreeService groupTreeService)
    {
        _context = context;
        _groupTreeService = groupTreeService;
    }
    ...
}
```
控制DBContext生命周期在函数内部
官方Doc：[启用RetryOnFailue情形下的手动事务方式](https://docs.microsoft.com/zh-cn/ef/core/miscellaneous/connection-resiliency#execution-strategies-and-transactions)
```
public interface IWorker
{
    void DoWork(Func<MyDbContext> dbFactory);
}

public class WorkerRunner
{
    private readonly DbContextOptions<MyDbContext> _dbOptions;

    private readonly List<IWorker> _workers;

    public WorkerRunner(DbContextOptions<MyDbContext> dbOptions, List<IWorker> workers)
    {
        _dbOptions = dbOptions;
        _workers = workers;
    }

    public void RunWorkers()
    {
        using (var context = new MyDbContext(_dbOptions))
        {
            using (var tran = context.Database.BeginTransaction())
            {
                foreach (var worker in _workers)
                    worker.DoWork(() =>
                    {
                        // This won't work
                        var db = new MyDbContext(_dbOptions);
                        // And this one will even throw exception when used with in-memory database (during unit testing)
                        db.Database.UseTransaction(tran.GetDbTransaction());
                        return context;
                    });

                tran.Commit();
            }
        }
    }
}
```
就是new一个DBContext用， <span style="color:#ff0;font-weight:bold">Caution!</span> 经测单靠new DBContext不能阻止transaction Error