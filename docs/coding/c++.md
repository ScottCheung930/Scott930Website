# C++

## 输入输出
- cin 标准输入流
- cout 标准输出流

### 输入字符和string类字符串

- ```cin >> str``` 会默认以空格作为输入结尾（空格仍保留在输入流中）
- 读入包含空格的一整行: ```getling(cin, line_var)```

### 输出格式控制符

```#include <iomanip>```

设定宽度(设定后全局保持有效): ```setw( int width) ```

设置输出为定点小数: ```setiosflags(ios::fixed) ``` 等同于在输出前使用 ```cout.setf(ios_base::fixed, ios_base::floatfield);```

```setprecision(1)```: 
与```ios::fixed```共用时，控制小数位数为1位；当单独使用时，意味着包括整数部分在内共1位（比如678.9在不使用fixed时保留1位精度，会使用科学计数法，显示为7e+02）

```cpp
//设定输出的保留精度位数为1位小数
cout << setiosflags(ios::fixed) << setprecision(1) << num << endl;
```

## 变量类型

note: c++的任何变量类型都是对象

- 初始化方式：
    ```cpp
    string str = "hello";
    string str("hello"); //调用构造函数
    string str(str0);    //调用构造函数
    string str{"hello"}; //仅在c++ 11及以后支持
    ```

- 可以赋值
    ```cpp
    string str1 = "hello";
    string str2 = str1; //对象赋值，并非指针
    //对比：c语言的char数组不能赋值
    ```
- 使用对象的指针，```&```，```*```, ```.```, ```->```的用法相同
### string 类

```#include <string>```
- 初始化方法：

    - 构造函数有optional argument：```string(..., int pos, int len)``` 表示从下标pos字符开始，取len个字符

- 可以直接使用```==```判断string字符串是否相等

- 可以使用```+```来进行字符串拼接，使用```+=```来append

- 可以**像**char数组一样用```[]```访问字符

- 成员函数
    ```cpp
    str.length()
    str.substr(int pos, int len)
    str.insert(size_t pos, const string& s);
    str.erase(size_t pos = 0, size_t len = npos);
    str.append(const string& str);
    str.replace (size_t pos, size_t len, const string& str);
    
    //找子串的位置
    size_t str.find(const string& str, size_t pos =0)
    if (str.find(substr) == string::npos){
    // string::npos 为string的静态成员常量，值为最大size_t值，表示没找到
        cout << "Not found!" << endl;
    }
    ```
