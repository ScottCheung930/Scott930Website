# STL
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

```stack```, ```queue```, ```priority_queue``` 没有迭代器！

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
常见错误：
```cpp
if(exist[key]=='1'){//隐式地创建entry！
    ...
}

if(exist.count(key)){...} //正确写法
```

## 遍历
### iterator
容器都有遍历的需求
```cpp
template<type> obj;
template<type>::iterator it;
it = obj.begin();
it = obj.end();

for(template<type>::iterator it = obj.begin();it!=obj.end();it++){
    cout << *it << " ";
}
```
### for each循环：iterator的语法糖
```cpp
for(type variable : container){
    loop statement;
}
```

另一种输入：
```cpp
int n;
cin >> n;
vector<int> nums(n);
for(auto& num:nums){
    cin >> num;
} 
```

## typedef & using

```cpp
map<string, list<string>> phonebook;
map<string, list<string>>::iterator it;//冗长

typedef map<string, list<string>> PB;
PB::iterator it;//ok

using PB = map<string,list<string>>;//类型变量
```