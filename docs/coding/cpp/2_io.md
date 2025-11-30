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

#### 按格式打印后复原输出格式

``` c++
void print_hex(std::ostream& os, int x) {
    auto old = os.flags();  // 保存

    os << std::hex << std::showbase << x;

    os.flags(old);          // 恢复
}
```

### iomanip
```iomanip```库存储带参数的格式操纵子和一些高级格式调整的工具. 需要```#include <iomanip>```

- 设定宽度: 
注意:不同于其它manipulator, ```setw```只影响下一次输出
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

- 使用```std::streamsize prec = os.precision()```保存输出精度状态;

- 使用```char fill_char = os.fill()```保存填充字符状态;

- 使用guard class来封装一个不影响整体的输出函数

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

## istream
### 输入字符和string类字符串

- ```cin >> str``` 会默认以空格作为输入结尾（空格仍保留在输入流中）
- 读入包含空格的一整行: ```getline(cin, line_var)```
- 读入一行直到指定分隔符：```getline(cin, line_var, delimeter)```
### 输入一行数字直到换行
```cpp
int num;
while(cin >> num){
    if(cin.getc()=='\n'){
        break;
    }
}
```

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