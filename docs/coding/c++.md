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

## 常用变量类型

Note: c++的任何变量类型都是对象

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


???+ Note
    容器(Container/Collection)是满足一系列条件的一种对象类型。这些条件包括必须提供迭代器方法，容量查询方法，修改操作方法（对于可修改容器），内存分配器方法等等。


???+ Note
    STL（Standard Template Library）是C++标准库的一部分，提供了一组标准的容器实现，其中某些容器为常见的数据结构。特定数据结构通常涉及特定的基础算法，STL还提供了一些常用的基础算法实现。

    - 模板（Template）类：模版类是生成类的类。可以通过向模板类传入参数生成类实例。
    - 下面是常见STL的内容
        - ```pair``` (pair of anything, ```int/int```, ```int/char```)
        - Container
            - ```vector``` (expandable array)
            - ```deque```(读音deck) (expandable array, expands at both ends)
            - ```list``` (double-linked array)
            - ```set```
            - ```map```
            - ```forward_list```
            - ```array```
            - ```string```
        - Basic Algorithms (sort, search, etc)
        - All identifiers in library are in the ```std``` namespace: ```using namespace std```

???+ Note
    泛型(Generic Class)编程是一种编程思想，其核心在于编写与具体数据类型无关的代码，从而使代码具有更高的复用性和灵活性。
    STL的模板类，例如vector<>就是一种泛型。

### vector
```cpp
vector<Elem> c;
vector<Elem> c1(c2);
vector<Elem> v(100); //preallocate capacity = 100，初始化为0
vector<Elem> c.reserve(100);//同上
vector<int> v(10,3) //size为10，所有element都初始化为3

v.size()
v.capacity()//可变，由内存分配器控制
v.empty() // ifEmpty ?
==,!=,<,>,<=,>=
v1.swap(v2) //swap v1 & v2

v.begin();
v.end();

v.at(); // read only!
v[ind];
v.front(); //first element
v.back(); //last element

v.push_back(e)
v.pop_back()
v.insert(pos,e)// pos 是iterator!
v.erease(pos) // pos 是iterator!
v.clear() //清空
v.find(first, last, item) // return 一个iterator!
```

#### 关于可变的vector长度
- ```push_back()```和```pop_back()```会自动改变capacity,但```[]``` 越界也会出问题
- 使用preallocate预先规定长度，会分配预先给定的capacity并初始化为0，所以size也会等于预先给定的长度
- 不预先给定长度，默认capacity和size就是0
- capacity>=size，但capacity什么时候增长与编译器有关

### list(双向链表)
只列出与vector不同的地方

没有下标访问

没有.capacity(因为始终等于size)

还有双向的push和pop
```cpp
x.push_front(item);
x.pop_front();
```

还可以移除从pos1到pos2(都是迭代器)的元素
```cpp
x.erase(pos1,pos2)
```

???+ Note
    关于选择不同的类型
    - vector 永远是默认选项

    - 需要随机访问elements，vector和deque更好

    - list和forward_list有存储指针的额外内存开销以及存储在堆，当elements很小又很多，且需要管理内存额外开销时，避免list

    - 当需要频繁在array中间插入，list和forward_list更好

    - 需要在array两侧插入，deque更好。需要注意在front端删除时vector和deque区别不大，但在front端插入时vector不好。

iterator的使用：
双向链表的iterator不存在内秉的大于小于关系！
```cpp
list<int> lst(100);
list<int>::iterator p; 
for(p=lst.begin();p!=lst.end();p++){
    //注意此处应使用!= 而非<=, p++只表示“下一个item”，并不代表index增长
    ...
}
//同理：
list<int>::iterator it1=lst.begin();
list<int>::iterator it2=lst.end();
while(it1!=it2){
    //此处应使用!=
    ...
} 
```
!!! Note
    容器都有迭代器，因为总是需要遍历操作

用iterator复制:
```c++
#include <iostream>
#include <algorithm>
#include <list>
#include <vector>
using namespace std;
int main()
{
    list<int> lst(100, 1);
    vector<int> v(100);
    copy(lst.begin(),
         lst.end(),
         v.begin());
    vector<int>::iterator it;
    for(it=v.begin(); it!=v.end(); it++){
        cout << *it << " ";
    }
    return 0;
}
```



### map

```cpp

#include<map>
#include<string>

map<string, float> price;
price["apple"]=1.111;
price["strawberry"]=2.4;

//初始化
map<string,int>=m{{"apple",1},{"strawberry",2},{"banana",3}};

//检查key是否存在(因为key唯一，所以是1或0)
m.count(key);

//删除
m.erase(key);

//清空
m.clear();

```