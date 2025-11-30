# 输入输出
- cin 标准输入流
- cout 标准输出流
- cerr 标准错误流
- clog 标准日志流/带缓冲的错误流

## ostream
ostream是一个类, cout是预定义的ostream类的对象
cerr和clog也是ostream类的对象, cerr无缓冲区(实际有, 但只是每次都flush()), clog有缓冲区

注意clog和cerr都与C语言的stderr相关联, 很多时候它们会绑定到相同streambuf(同一个stderr缓冲区), 只是cerr默认每次都调用.flush(), 而clog并不会每次都flush(). 不过标准并不保证它们共享缓冲区, 若需要clog立刻输出, 应直接换成cerr或手动调用clog.flush().

### fmtflags

C++用bitmask表示各种格式控制开关, 而整体的掩码可以通过```os.flags()```获得.```std::ios::fmtflags```是一个bitmask类型,  ```ios```被包含在```iostream```里. fmtflags包含不同功能的几个字段, 可以通过```cout.setf```直接设置某个字段的bitmask, 比如可以通过:
- ```std::cout.setf(std::ios::hex, std::ios::basefield);```把进制字段basefield 清空，再置表示16进制的比特位.
- ```std::cout.setf(std::ios::hex);```按位或上表示16进制的比特位(没有把其它位置零, 可能冲突).

但一般不会直接操纵bitmask, 而是通过对应的**操纵子(manipulator)**实现, 例如上述设置hex的操作等价于 ```cout << hex```. 这里是```<<```被重载, 使得其接受下一个操作数```hex```为函数指针, 再调用hex函数, 而hex函数就包装了```setf(std::ios::hex, std::ios::basefield)```.

#### 常用的```fmtflag```操纵子
1. 数字进制
    - ```std::dec```
    - ```std::dec```
    - ```std::oct```

2. 浮点格式
    - ```std::fixed```
    - ```std::scientific```
    - ```std::hexfloat```

3. 对齐方式
    - ```std::left```     // 左对齐
    - ```std::right```    // 右对齐（默认）
    - ```std::internal``` // 符号在左，数字右对齐（常配合宽度和填充）

4. 其它

| flag         | 操纵子              | 作用                                |
| ------------ | ---------------- | --------------------------------- |
| `showbase`   | `std::showbase`  | 显示进制前缀：`0x`、`0` 等                 |
| `showpos`    | `std::showpos`   | 正数前加 `+`                          |
| `showpoint`  | `std::showpoint` | 浮点数即使是整数也显示小数点与尾零                 |
| `uppercase`  | `std::uppercase` | `E`、`X` 等字母大写                     |
| `boolalpha`  | `std::boolalpha` | `bool` 以 `true/false` 输出而不是 `1/0` |
| `skipws`     | `std::skipws`    | 输入时跳过前导空白（默认开）                    |
|              | `std::noskipws`  | 输入时不跳过空白                          |
| `unitbuf`    | `std::unitbuf`   | 每次输出都立即 flush                     |

### iomanip
```iomanip```库存储带参数的格式操纵子和一些高级格式调整的工具. 需要```#include <iomanip>```

- 设定宽度: 
注意:不同于其它manipulator, ```setw```只影响下一次`<<`
``` cpp
cout << setw(4) << num;
```

- 设定小数精度: 
``` cpp
double num = 1.23456;
cout << setprecision(3) << num; //得到1.235
```

- 设定定点小数位数(与```fmtflags```的```std::fixed```连用)
``` cpp
double num = 1.2,num2 = 1.2345;
cout << fixed<<setprecission(3)<<num; //1.200
cout << fixed<<setprecission(3)<<num2; //1.235
```

- 设置前导零
``` cpp
cout << setw(4) <<setfill('0')<< 1 //得到0001(默认std::right)
```

- 设置进制(对```fmtflags```的封装), 只支持8,10,16
``` c++
cout << setbase(8) << 16 //20 
```

- 包装fmtflags
``` cpp
ios::fmtflags f = ios::showbase | ios::uppercase | ios::showpos;
cout << setiosflags(f) << hex << 255;
```
``` cpp
void apply_format(std::ostream& os, std::ios::fmtflags f) {
    os << std::setiosflags(f);
}

```

### 改输出格式后恢复
- 对于fmtflags, 可以使用```std::ios::fmtflags flags = os.flags()```保存状态;
``` c++
void print_hex(std::ostream& os, int x) {
    auto old = os.flags();  // 保存

    os << std::hex << std::showbase << x;

    os.flags(old);          // 恢复
}
```

若使用了不在fmtflags范围内的格式控制选项(如下所示), 还应:

- 使用```std::streamsize prec = os.precision()```保存输出精度状态, 再使用```os.precision(prec);```恢复;

- 使用```char fill_char = os.fill()```保存填充字符状态, 再使用```os.fill(fill_char)```恢复;

- 注意: ```setw```也不在fmtflags范围之内但其只影响下一次`<<`;

#### 使用guard class来封装一个不影响整体的输出函数

``` c++
struct ios_guard {
    std::ios& os;
    std::ios::fmtflags flags;
    std::streamsize prec;
    char fill_char;

    explicit ios_guard(std::ios& os_)
        : os(os_), flags(os_.flags()),
          prec(os_.precision()), fill_char(os_.fill()) {}

    ~ios_guard() {
        os.flags(flags);
        os.precision(prec);
        os.fill(fill_char);
    }
};

void myPrint(std::ostream& os, double x) {
    ios_guard _{os};  // 作用域内临时改格式

    os << std::showpos
       << std::hexfloat
       << std::setprecision(5)
       << std::setfill('0')
       << x;
}   // 离开作用域自动恢复 flags/precision/fill
```

### 无格式输出

需要按严格字节输出, 或者需要高性能地写大块缓冲区, 且不需要格式控制时使用.

- ```cout.put(char ch)``` 输出一个字符, 忽略所有格式(即使之前设置过), 不会自动flush缓冲区(有缓冲)
    
    ```cout.put(65);```输出字母`A`.

- ```cout.write(const char* s, std::streamsize n)``` 从地址s开始, 输出n个字符(不会遇到```\0```而停止), 无自动flush.

### 输出重定向
- ```1 > file```重定向标准输出, ```2 > file```重定向标准错误


## istream
### 整行输入 ```cin.getline()```或```string::getline()```
- 作为```char[]```输入: ```cin.getline(char* , streamsize )```
    参数为C风格字符数组和最大输入长度
    ``` c++
    char buf[1024]{0};
    cin.getline(buf, sizeof(buf)-1);//-1为了留出'\0'的空间
    ```
    也可以读入直到指定分隔符
    ```cin.getline(char*, streamsize, delemeter)```
- 作为```string```类输入 (需```#include<string>```):
    - 读入包含空格的一整行: ```getline(cin, line_var)```
    - 读入直到指定分隔符：```getline(cin, line_var, delimeter)```

### 按字符输入 ```cin.get()```
- 输入一行按空格分隔的数字
    ```cin >> str``` 会默认跳过开始的空格, 并以空格或换行作为输入结尾（空格或换行仍保留在输入流中!）;
```cpp
int num;
vector<int> nums;
while(cin >> num){
    nums.push_back(num);
    if(cin.get()=='\n'){
        break;
    }
}
```

- 输入直到换行或指定分隔符的另一种方法
```cpp
string str;
for(;;){
    char c = cin.get()
    if(cin.get()=='\n'){
        ......
        break;
    }
    str += c;
}
```

### cin错误处理

#### cin.rdstate()
```ios::iostate rdstate()```是输入输出流的一组状态位, 其包含以下标志位:
``` c++
ios::goodbit  // 0，表示目前没有错误
ios::eofbit   // 读到 EOF（文件/输入结束）
ios::failbit  // 格式错误，或操作失败（但流本身没坏）
ios::badbit   // 输入流错误（比如底层设备损坏）
```
每次cin输入后,根据操作是否出错以及何种错误, 会自动更新rdstate()
- 正常状态: ```cin.rdstate() == ios::goodbit``` 为true
   注意: goodbit值为0
- 出错: 若多种错误同时发生, rdstate等于多种错误标志位的按位或
若手动判断, 可以如下进行:
``` c++
auto state = cin.rdstate();
if (state & ios::eofbit)  { /* 到 EOF 了 */ }
if (state & ios::failbit) { /* 输入格式错误 or 读取失败 */ }
if (state & ios::badbit)  { /* 输入流损坏(输入设备坏了)*/ }
```
#### 判断函数```good()/fail()/bad()/eof()```

```good()/fail()/bad()/eof()```是对rdstate()判断的封装:
```c++
cin.good()  // 等价于 rdstate() == goodbit
cin.eof()   // rdstate() & eofbit
cin.fail()  // rdstate() & (failbit | badbit)  
// 注意：fail() 包含 badbit
cin.bad()   // rdstate() & badbit
```

failbit主要出现在输入格式不匹配的情况.

常见用法是:
- 通过流对象的```operator bool()```重载, 流对象在条件判断里返回```!fail()```
```cpp
while(cin>>x){...} //等价于while(!(cin>>x).fail()){ }
```

- 通过流对象的```operator !()```重载, ```!```之后的流对象会返回```fail()```
``` c++
if(!cin){...} ///等价于if(cin.fail()
```

???+ Note "while (cin >> x)为什么不等于while ((cin >> x).good()?)"
    ```while ((cin >> x).good()```会读不到"恰好在文件结尾的那个字符"

    例如文件内容"1 2 3"(无多余空格)

    ``` c++
    while (cin>>x){...}
    ``` 
    在第三次循环时会读到3, 此时eofbit被设置, cin.good()为false, cin.fail()为false. 若采用```while ((cin >> x).good()```, 第三次循环将不执行循环体直接结束, 而采用```while (cin >> x)```则将执行函数体, 并在第四次循环时因为读取不到任何字符而设置failbit, cin.fial()为true, 退出.
    

## sstream
### istringstream, ostringstream

istringstream 可以作为输入流；
ostringstream 可以作为输出流；

输入空格分隔的一行多整数
```cpp
string line = "10 20 30"
istringstream iss(line);
int x;
vector<int> a;
while(iss>>x) a.push_back(x);
```

输入指定分隔符的元素
```cpp
string s = "1.2.3.4"
istringstream iss(s);
string part;
while(getline(iss,part,'.')){
    //part可能为空，例如"1..3"会得到一个空part
}
```

自定义输入函数
```cpp

vector<int> parseInput(string& s){
    istringstream iss(s);
    vector<int> nums;
    string part;
    while(getline(iss,part,'.')){
        nums.push_back(stoi(part));
    }
    return nums;
}


int main(){
    string s;
    getline(cin,s);
    vector<int> nums;
    nums=parseInput(s);
}

```

实现类似sprintf的输出到字符串
```cpp
double x = 3.14159; int n = 7;
ostringstream oss;
oss << "x=" << fixed << setprecision(2) << x
    << ", n=" << setw(3) << setfill('0') << n; // 001
string out = oss.str();   // "x=3.14, n=007"
```

构造错误/日志信息
```cpp
int row = 5, col = -1;
ostringstream oss;
oss << "Invalid index (" << row << ", " << col << ")";
throw runtime_error(oss.str());
```