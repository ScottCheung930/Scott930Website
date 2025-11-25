# C语言复习

## main函数入口
可以通过main函数获取参数个数，参数列表，以及环境变量
``` c++
int main()
int main(int argc, char* argv[])
int main(int argc, char* argv[], char* env[]) //非标准
```

- argc在不传参的情况下为1 （这个可执行文件本身的名称）
- argv和env是指针数组，以argv[argc] == NULL 和env[envc] == NULL作为结束哨兵，但一般还是通过argc来for循环遍历argv.
- env作第三个形参的写法并非C/C++标准，但有时也可以用。
    - POSIX（Linux等）:
    ``` c++
    #include <unistd.h> //通常unistd.h中会声明environ，若声明，不用写下一句，但写了也没事因为重复声明是允许的
    extern char **environ
    ```

- VS中配置命令参数：解决方案管理器选项卡-解决方案上右键菜单-属性-调试-命令参数

## signed/unsigned char
char其实可以用来处理单字节整型, 例如使用GCC/G++编译器, 下面的两段代码都输出```-1```
``` c
#include<stdio.h>
using namespace std;
int main() {
    char c = -1;
    printf("%d\n", c);
    return 0;
}
```
``` c++
#include <iostream>
using namespace std;
int main()
{
    char c = -1;
    cout << (int)c << endl;
    return 0;
}
```

因此char也有signed和unsigned, x86平台大多默认signed char, 嵌入式平台例如arm大多是unsigned char. 显式使用signed/unsigned char才能确保可移植性。

若对unsigned char赋值为-1，补码转换使其解释为255
``` c
unsigned char uc = -1;
printf("unsigned char: %d\n", uc); //输出255
```

例如，下方c++代码是将字符串转换为Base16编码，其中的for循环中一定要使用unsigned char，否则会导致字符串下标越界
``` c++
static const string base16_enc_tab("012345678ABCDEF");

string testStr = "测试用于base16的字符串";
    string base16str;
    for (unsigned char c : testStr) {// (1)!
        char high = c >> 4;
        char low = c & 0b00001111;
        base16str += base16_enc_tab[high];
        base16str += base16_enc_tab[low];
    }
    cout << "Origin:\t" << testStr << endl;
    cout << "Base16:\t" << base16str << endl;
```

1. 
    若for循环中使用char, 由于```c```被解释为了signed char, ```>>```被解释为算术右移(保留符号位), 因此变量```high```在作为下标使用时被转换为unsigned的size_t类型, 从而变成一个巨大的正数, 导致下标越界.

## 算术右移/逻辑右移
逻辑右移:右移所有bit; 算术右移:符号位不动, 右移其它bit

- 对无符号数是逻辑右移

- 对有符号正数, 逻辑右移和算术右移相同

- 对有符号负数, 由编译器决定实现, 但一般为算术右移

## c语言一些字面量的表示

- 整型常量

| 进制   | 形式                  | 说明             | 例子（类型大致）                    |
| ---- | ------------------- | -------------- | --------------------------- |
| 十进制  | `[1-9][0-9]*` 或 `0` | 默认 10 进制       | `int a = 123;`              |
| 八进制  | `0[0-7]*`           | 以 `0` 开头（历史包袱） | `int b = 0123; // 十进制 83`   |
| 十六进制 | `0x`/`0X` + 十六进制数字  |                | `int c = 0x1A3; // 十进制 419` |

- 整型后缀

| 后缀          | 含义                   | 例子                                                           |
| ----------- | -------------------- | ------------------------------------------------------------ |
| `u` / `U`   | 无符号 unsigned         | `unsigned x = 10u;`                                          |
| `l` / `L`   | long                 | `long y = 10L;`                                              |
| `ll` / `LL` | long long            | `long long z = 10LL;`                                        |
| 组合          | 无符号 + long/long long | `unsigned long a = 10UL;`<br>`unsigned long long b = 10ULL;` |

???+ Note
    没有后缀时, 编译器会按照int -> long -> long long 的顺序判断字面量类型

???+ Note
    标准C11并没有```0b1101```这类二进制字面量, 在C23才正式加入标准, 但常有编辑器扩展.

- 浮点常量

| 类别     | 形式                                                   | 说明            | 例子                                       |
| ------ | ---------------------------------------------------- | ------------- | ---------------------------------------- |
| 十进制浮点  | `digits.digits` 或 `digits.` 或 `.digits`，可选 `e/E±exp` | 默认类型 `double` | `double a = 3.14;`<br>`double b = 1e-3;` |
| 十六进制浮点 | `0x` 开头 + 十六进制小数 + `p/P±exp`                         | 指数是 **2 的幂**  | `double c = 0x1.8p1; // 1.5 × 2¹ = 3.0`  |

- 类型后缀

| 后缀        | 类型            | 例子                       |
| --------- | ------------- | ------------------------ |
| 无         | `double`      | `double a = 3.14;`       |
| `f` / `F` | `float`       | `float b = 3.14f;`       |
| `l` / `L` | `long double` | `long double c = 3.14L;` |

- 字符常量

| 前缀       | 类型                         | 例子                                  |
| -------- | -------------------------- | ----------------------------------- |
| 无        | `int`（窄字符，注意 C 中不是 `char`） | `int c1 = 'A';`<br>`int c2 = '\n';` |
| `L`      | `wchar_t`                  | `wchar_t wc = L'中';`                |
| `u`（C11） | `char16_t`                 | `char16_t c16 = u'中';`              |
| `U`（C11） | `char32_t`                 | `char32_t c32 = U'中';`              |

C语言中使用unicode(char16_t, char32_t)需要通过```<uchar.h>```提供typedef

???+ Note
    关于C语言中的字符字面量的类型为什么是int

    C语言早期要求, 字符常量的类型能表示所有unsigned char的取值范围, 而char有时默认为signed char, 无法表示unsigned char, 所以使用int.

    例如,使用gcc编译器编译如下代码(test.c)

    ``` c
    #include <stdio.h>

    int main()
    {
        printf("%d\n", sizeof(int));
        printf("%d\n", sizeof(char));
        printf("%d\n", sizeof('A'));//(1)!
        return 0;
    }
    ```

    1. 
        ```
        4
        1
        4
        ```

    而使用g++编译器编译如下代码(test.cpp)

    ```c++
    #include <stdio.h>

    int main()
    {
        printf("%d\n", sizeof(int));
        printf("%d\n", sizeof(char));
        printf("%d\n", sizeof('A'));//(1)!
        return 0;
    }
    ```

    1. 
        ```
        4
        1
        1
        ```

**转义形式**

```
int c3 = '\x41';  // 十六进制转义，'A'
int c4 = '\101';  // 八进制转义，'A'
```

- 字符串字面量

| 前缀        | 类型（C11）                | 例子                        |
| --------- | ---------------------- | ------------------------- |
| 无         | `char[]`               | `char s[] = "hello\n";`   |
| `L`       | `wchar_t[]`            | `wchar_t ws[] = L"你好";`   |
| `u8`（C11） | `char[]`，内容保证 UTF-8 编码 | `char s8[] = u8"你好";`     |
| `u`（C11）  | `char16_t[]`           | `char16_t s16[] = u"你好";` |
| `U`（C11）  | `char32_t[]`           | `char32_t s32[] = U"你好";` |

字符串可以相邻拼接:
```
char msg[] = "hello, "
             "world";   // 等价于 "hello, world"
```

- 空指针字面量

```
int *p1 = 0;          // 整数字面量 0 转换为空指针
int *p2 = NULL;       // 宏，一般定义为 ((void*)0)
```
C23 开始才有真正的 nullptr 常量

- 布尔值

需要```stdbool.h```, 实则时宏定义true为1, false为0;

```
bool b0 = false;
bool b1 = true;
```

## C++11相对于C11的字面量

- 布尔值

内建.

- 空指针

```nullptr```.
```int *p = 0```仍然合法, NULL被宏定义成0, 但重载时语义模糊

- 字符串字面量

```"abc"```的类型是```const char[4]```

``` c++
const char* s = "abc" //C++中合法
// char* s = "abc"    // C中能通过编译, 但s并非数组类型, 修改s[n]是UB!
                      // 无法通过C++编译(const char[]不能赋值给char*) 
```

- Unicode字面量

```char16_t``` ```char32_t```变为内建类型

- 原始字符串(Raw String Literal)

中间的内容几乎不需要转义, 可以直接放反斜杠和双引号;
前面可以配合 u8, u, U, L 形成不同字符集的原始字符串.

``` c++
const char* pat = R"(\d+\s+".*")";
// 实际内容是：\d+\s+".*"

const wchar_t* wpat = LR"(行首^\s+行尾$)";
const char16_t* s16 = uR"(路径 C:\temp\foo.txt)";
```

- 用户自定义字面量

```operator""```通过用户自定义字面量重载

``` c++
// 把浮点字面量加后缀 _km 变成“米”
long double operator"" _km(long double x) {
    return x * 1000.0L;
}

auto d = 1.2_km;  // d == 1200.0L
```

## 数组与指针: array-to-pointer decay 和 形参类型调整

C/C++标准中两条关键的规则:

- 数组到指针的转换

    除了作为 sizeof 的操作数, 单目 & 的操作数, 或字符串字面量初始化数组的情况之外, 一个表达式如果是"数组类型", 会被转换为"指向该数组第一个元素的指针".

- 形参类型调整规则

    声明为 “数组类型” 的参数会被**调整（adjust）**成 “指向元素类型的指针”。
    声明为 “函数类型” 的参数会被调整成 “指向该函数类型的指针”。

### 字符串的初始化 vs 字符串首字符指针

``` 
char s1[] = "hello";
char* s2  = "hello";
```

在C语言中,上面一行是正常的数组通过字面量来初始化,下面一行则是字符指针存了字面量的首字符地址.

sizeof(s1) = 6, sizeof(s2) = 8(x64平台), 说明一个是数组类型, 一个是指针类型.

第一行这样的写法是只读的:
``` c
#include <stdio.h>

int main()
{
	char *s = "hello";
	s[1] = 'a'; // 未定义行为, 运行时这一段会发生segmentation fault
	printf("%c\n", s[1]);
	return 0;
}
```
由于数组->指针转换, "hello"字面量在赋值时转换为了指向字符串首字符的指针, 而这个字符串字面量是存储于常量存储区的, 对常量存储区进行写入导致段错误. 

而下面的代码就可以正常运行
``` c
#include <stdio.h>

int main()
{
	char s[] = "hello";
	s[1] = 'a';
	printf("%c\n", s[1]);
	return 0;
}
```

在C++中,上面一行依然可行, 下面一行无法通过编译.

### 数组作形参的几种写法

``` c
void f(char s[]);
void f(char s[10]);
void f(char *s);
```
在C语言中, 由于发生了数组到指针转换, 这三个声明是等同的. 可以如下验证: 将三种写法中的任意两种, 一种作函数声明, 另一种作函数定义, 可以通过编译并正常运行.

``` c
#include <stdio.h>

void f(char s[]);
void f(char *s)
{
	printf("%s", __PRETTY_FUNCTION__);
}

int main()
{
	char s[10] = "hello";
	f(s);
	return 0;
}
```

在C++中也有相同规则:下述写法在C++中会报重复声明而非重载
``` c++
#include <iostream>
using namespace std;

void f(char s[10]) {
	cout << __FUNCSIG__ << endl;
}
void f(char* s) {
	cout << __FUNCSIG__ << endl;
}

int main()
{
	char s[10] = "hello";
	f(s);
	return 0;
}
```

### 多维数组的传参