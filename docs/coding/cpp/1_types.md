# C++的类型
与C相同的略。
主要包含string, enum

## string 类

```#include <string>```

### 初始化方法：
    
默认空串

除了常用的构造函数，还有：

- ```string(const string& str, int pos, int len)``` 表示从下标pos开始，复制str的len个字符
- ```string(const char* s, size_t n)``` 复制C风格字符串的前n个字符
- ```string(size_t n, char c)``` 生成n个c字符的字符串

### 基本特性

- 同样有size和capacity，capacity更大，capacity为排除'\0'之后的容积

- 用.empty()判断空串。可以直接使用```==```和```!=```判断string字符串是否相等，可以使用```<```或```>```按字典序直接比较

- 可以使用```+```来进行字符串拼接，使用```+=```来append

- 可以**像**char数组一样用```[]```访问字符

### 成员函数

``` c++
str.length()

//截取拼接
str.substr(int pos) //取从pos开始直到末尾的字符串
str.substr(int pos, int len)
str.append(const string& str);

//插入删除
str.insert(size_t pos, const string& s);
str.erase(size_t pos = 0, size_t len = npos);

//查找
size_t str.find(const string& str, size_t pos =0) 
if (str.find(substr) == string::npos){// (1)!
    // string::npos 为string的静态成员常量，值为最大size_t值，表示没找到
    cout << "Not found!" << endl;
}

//替换：从pos开始的len个字符，替换成str
str.replace(size_t pos, size_t len, const string& str);
```

1. 
    ``` c++
    #include <iostream>
    #include <string>
    using namespace std;

    int main() {
        string str("Hello, World!");
        cout << (str.find("7788") == -1) << endl;
        cout << str.find("7788")<< endl;
        return 0;
    }
    ```
    This code's output is:
    ```markdown
    1
    18446744073709551615
    ```
    如果没有找到子串， str.find("7788") 将返回 std::string::npos ，这是一个无符号值，通常等于 size_t 可表示的最大值（64 位系统上为 18446744073709551615）。将该值与 -1 比较时，字面量 -1 会被隐式转换为无符号 size_t 值。一个有符号数转为无符号数是对无符号数的最大值取mod，-1对 $2^{64}$ 取模即为 $2^{64}-1$ 。

    之所以是-1被隐式转换而非size_t，是因为根据 C++ 标准的常规算术转换，当一个操作中有一个无符号整数和一个有符号整数时，如果无符号类型可以表示有符号类型的所有值，则有符号值将转换为无符号类型。由于 size_t 是无符号的，因此字面形式 -1 将被转换为 size_t 值。
    
注意上述成员函数.insert, .append, .erase, .replace都是就地修改(mutating)的！(而不是拷贝并返回一个新的str)
它们的返回值是对原string对象的引用，因此也允许链式调用：

``` c++
std::string s = "abc";
s.append("XYZ")        // s: "abcXYZ"
.replace(0, 1, "A")   // s: "AbcXYZ"
.insert(2, 3, '-');   // s: "Ab---cXYZ"
```

### 字符串和数字转换

- ```stoi()``` string to integer
- ```stod()``` string to double
- ```stof()``` string to float
- ```stoll()``` strint to long long

```c++
auto num1 = stoi("1234");
auto num2 = stod("123.4");
auto num3 = stof("123.4");
auto num4 = stof("123.5f"); // 123.5f显式表示其为float类型
```

上述函数出错时会抛出异常可以被捕获

- ```to_string()``` 重载了多种类型

```c++
cout << to_string(-123.4) << endl;
```

### 字符串拼接

- 可以通过 ```+```或```+=```， 或者```append```
- 也可以通过流 ```sstream```：

``` c++
#include <sstream>
#include <iomanip>
#include <iostream>
int main(){
    double x = 3.14159;
    int n = 7;

    std::ostringstream oss;
    oss << "x=" << std::fixed << std::setprecision(2) << x << ", n=" << std::setw(3) << std::setfill('0') << n; // 宽度3、前导0

    std::string s = oss.str(); 
    std::cout << s << std::endl;//(1)!
}
```

1. 
    ```
    x=3.14, n=007
    ```

### 技巧

- 批量进行string的字符替换 
    ```c++
    replace(str.begin(),str.end(),'a','b')//批量把a换成b
    ```


## enum 类

- c++11之前/C
``` c++
enum LogLevel {
    DEBUG, //默认从0开始
    INFO//若无赋值，值为上一个枚举值+1
    ERROR = 5, //可赋值
    FATAL //依然为上一个枚举值+1 （枚举值=6）
};
cout << DEBUG <<endl;
LogLevel logLevel{FATAL};
if(logLevel == 6){
    cout << "FATAL!" << endl;
}
int val_error = ERROR
if(logLevel == val_error){
    cout << "ERROR!" << endl;
}
```
用于消息类型/日志级别
可以当成整数使用
容易跟宏或者别的枚举类型混淆（所以会定义成LOGLEVEL_ERROR）

- c++11之后
``` c++
enum class LogLevel {
    DEBUG, 
    INFO,
    ERROR,
    FATAL
};
cout << (int)LogLevel::DEBUG <<endl;
int val_error = static_cast<int>(LogLevel::ERROR)
```
无法直接当成整数使用，必须显式类型转换

