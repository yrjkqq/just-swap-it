# %% [markdown]
# # Python 速成教程：基础语法 (Y分钟速成X 风格)
# 
# 这里是一个可以实时运行的 Python 教程。
# 只要安装了 Python 插件和 Jupyter 插件，
# 点击下面每个代码块上方出现的类似 "Run Cell" (运行单元格) 的按钮，就可以实时运行代码并查看结果。

# %%
# 1. 打印与变量 (Print & Variables)
print("Hello, World!")

message = "Welcome to Python"
year = 2024
print(f"{message} in {year}") # 推荐使用 f-string 格式化输出

# %%
# 2. 基本数学运算 (Math)
# a = 10
# b = 3
# print("加:", a + b)
# print("减:", a - b)
# print("乘:", a * b)
# print("除 (真实除法，保留小数):", a / b)
# print("整除 (去除小数):", a // b)
# print("取模 (求余数):", a % b)
# print("幂 (a的b次方):", a ** b)
# print(10//3)
a = [1, 2, 3, 4]
b = a
print(b is a)
print(b == a)
b = [1, 2, 3, 4]
print(b is a)
print(b == a)
"Hello" "world!"[0]
len("hello")

# %%
# 3. 基础类型与类型转换 (Types & Type Conversion)
integer_num = 42
float_num = 3.14
boolean_val = True
string_val = "100"

print("integer_num 类型:", type(integer_num))
print("float_num 类型:", type(float_num))

# 转换类型 (Casting)
converted_int = int(string_val)
print("字符串转换为整数计算:", converted_int + 50)

# %%
# 4. 控制流：If / Elif / Else (Control Flow)
score = 85
if score >= 90:
    print("成绩: 优秀")
elif score >= 60:
    print("成绩: 及格")
else:
    print("成绩: 不及格")

# %%
# 5. 循环：For 循环 (Loops)
# range(5) 会依次生成 0, 1, 2, 3, 4
print("--- range 循环 ---")
for i in range(5):
    print(f"当前是第 {i} 次迭代")

print("\n--- 遍历列表 ---")
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("水果:", fruit)

# %%
# 6. 循环：While 循环
count = 3
print("开始倒计时...")
while count > 0:
    print(count)
    count -= 1
print("发射！")

# %%
# 7. 函数定义与调用 (Functions)
def add_numbers(x, y):
    """
    这是一个文档字符串 (Docstring)，用于描述函数的功能。
    它将 x 和 y 相加并返回结果。
    """
    return x + y

result = add_numbers(10, 20)
print("调用函数：10 + 20 =", result)
