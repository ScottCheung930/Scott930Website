# string 类

```#include <string>```

- 初始化方法：

    - 构造函数有optional argument：```string(..., int pos, int len)``` 表示从下标pos字符开始，取len个字符

- 可以直接使用```==```判断string字符串是否相等，可以使用```<```等直接比较

- 可以使用```+```来进行字符串拼接，使用```+=```来append

- 可以**像**char数组一样用```[]```访问字符

- 成员函数

    ``` c++
    str.length()
    str.substr(int pos, int len)
    str.insert(size_t pos, const string& s);
    str.erase(size_t pos = 0, size_t len = npos);
    str.append(const string& str);
    str.replace (size_t pos, size_t len, const string& str);

    //找子串的位置
    size_t str.find(const string& str, size_t pos =0) 
    if (str.find(substr) == string::npos){// (1)!
    // string::npos 为string的静态成员常量，值为最大size_t值，表示没找到
        cout << "Not found!" << endl;
    }
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


