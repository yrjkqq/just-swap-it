# %% [markdown]
# # Python 速成教程：数据结构
# 
# 学习 Python 中最常用的四种内置数据结构：
# 列表 (List)、元组 (Tuple)、字典 (Dictionary)、集合 (Set)。

# %%
# 1. 列表 (List) - 有序，可修改 (Mutable)
my_list = [10, 20, 30, 40]
print("原始列表:", my_list)

my_list.append(50)      # 在末尾添加元素
print("添加后:", my_list)

first_item = my_list[0] # 索引访问（从0开始）
print("第一个元素:", first_item)

my_list[0] = 99         # 修改元素
print("修改首元素后:", my_list)

# 切片访问 [start:end] (包含 start, 不包含 end)
print("前三个元素:", my_list[0:3])

# %%
# 2. 元组 (Tuple) - 有序，不可修改 (Immutable)
# 通常用于存储不希望被改变的一组数据
my_tuple = ("苹果", "香蕉", "橙子")
print("元组:", my_tuple)
print("第一个元素:", my_tuple[0])

# my_tuple[0] = "葡萄"  # 尝试取消这行注释后运行，会报错：TypeError: 'tuple' object does not support item assignment

# 解包 (Unpacking)
a, b, c = my_tuple
print(f"解包后: a={a}, b={b}, c={c}")

# %%
# 3. 字典 (Dictionary) - 键值对映射，无序(从Python3.7起自动保留插入的顺序)，可修改
my_dict = {
    "name": "Alice",
    "age": 25,
    "city": "Beijing"
}
print("字典:", my_dict)

# 获取值
print("名字:", my_dict["name"])

# 推荐使用 get 获取值（如果键不存在，不会报错，而是返回 None 或自定义默认值）
print("职业:", my_dict.get("job", "未知职业"))

# 修改和添加键值对
my_dict["age"] = 26
my_dict["job"] = "Engineer"
print("更新和添加键值对后:", my_dict)

# 遍历字典
print("\n遍历字典：")
for key, value in my_dict.items():
    print(f"  {key} -> {value}")

# %%
# 4. 集合 (Set) - 无序，强制元素唯一，支持集合运算
# 常用于高效去重和测试成员资格
my_set = {1, 2, 2, 3, 3, 4}
print("集合 (自动去重):", my_set)

set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

print("集合A:", set_a)
print("集合B:", set_b)
print("交集 ('&' 在a中也在b中):", set_a & set_b)
print("并集 ('|' 在a中或在b中):", set_a | set_b)
print("差集 ('-' 在a中但不在b中):", set_a - set_b)

# %%
# 小结：
# - 列表 List  : [a, b, c] - 使用最广泛，增删灵活
# - 元组 Tuple : (a, b, c) - 只读数据，更安全、占用内存小
# - 字典 Dict  : {k: v}    - 精确查表，用键名访问
# - 集合 Set   : {a, b}    - 去重，计算集合逻辑快速
