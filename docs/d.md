这个公式确实很容易绕晕，特别是在做前端开发的时候。无论是 Uniswap 还是其他 DeFi 协议，处理 **Decimals（精度）** 都是最容易出 Bug 的地方。

我用一个**具体的例子**来拆解这个公式，保证你立刻明白。

### 1. 为什么需要调整精度？

在区块链上，Token 是没有小数点的。
*   **USDC** (6位精度): 你钱包里有 1 个 USDC，链上存的是 `1000000`。
*   **ETH** (18位精度): 你钱包里有 1 个 ETH，链上存的是 `1000000000000000000`。

Uniswap 的核心公式 $x \cdot y = k$ 里的 $x$ 和 $y$，用的都是这种**链上原始整数**（Raw Amount）。

所以，当你算出“价格” $P_{raw} = y / x$ 时，这个价格其实是：
$$ P_{raw} = \frac{\text{Raw Amount Y}}{\text{Raw Amount X}} $$

这就导致了一个巨大的数量级偏差。

---

### 2. 举个栗子：ETH/USDC 池子

假设：
*   **Token 0**: USDC (精度 6)
*   **Token 1**: ETH (精度 18)
*   **当前真实市价**: 1 ETH = 2000 USDC

**在链上，池子里大概会有多少币？**
为了简化，假设池子正好平衡：
*   **USDC 数量 (Raw)**: 2000 个 USDC = `2000 * 10^6` = `2,000,000,000`
*   **ETH 数量 (Raw)**: 1 个 ETH = `1 * 10^18` = `1,000,000,000,000,000,000`

**如果你直接算价格 $P_{raw}$ (Token0 / Token1):**
$$ P_{raw} = \frac{\text{USDC Raw}}{\text{ETH Raw}} = \frac{2,000,000,000}{1,000,000,000,000,000,000} $$
$$ P_{raw} = 0.000000002 $$

**等等！** 现在的价格明明是 2000，为什么算出来是 `0.000000002`？
这就是因为 **Decimals 不对齐**。ETH 的精度比 USDC 多了 12 位（18 - 6），导致分母极其巨大，把结果压扁了。

---

### 3. 套用公式修正

为了得到人类可读的 `2000`，我们需要把这两个 Token 的精度差补回来。

公式：
$$ P_{actual} = P_{raw} \times \frac{10^{\text{Decimal1}}}{10^{\text{Decimal0}}} $$
*(注意：Uniswap 价格通常是指 `Price of Token0 in terms of Token1` 或者反过来，这取决于你定义的价格是 Price0 还是 Price1。上面我的公式里是把 $x$ 当分母，$y$ 当分子)*

**让我们修正上面的例子（求 ETH 对 USDC 的价格）：**

这里我们要算的是 **每 1 个 ETH 值多少 USDC**。
所以在人类逻辑里：
$$ P_{actual} = \frac{\text{USDC 真实数量}}{\text{ETH 真实数量}} $$

$$ P_{actual} = \frac{\text{USDC Raw} / 10^6}{\text{ETH Raw} / 10^{18}} $$

$$ P_{actual} = \frac{\text{USDC Raw}}{\text{ETH Raw}} \times \frac{10^{18}}{10^6} $$

$$ P_{actual} = P_{raw} \times 10^{(18-6)} $$

$$ P_{actual} = 0.000000002 \times 10^{12} = 2000 $$

**这就对上了！**

---

### 4. 总结成前端口诀

在前端代码里（比如 JS/TS），当你从 Uniswap 合约拿到 `sqrtPriceX96` 并算出 `rawPrice` 后，必须做这一步：

**如果你算的是 Price0 (即 1个 Token0 = 多少 Token1):**
$$ \text{真实价格} = \text{RawPrice} \times \frac{10^{\text{Token0的精度}}}{10^{\text{Token1的精度}}} $$

**如果你算的是 Price1 (即 1个 Token1 = 多少 Token0):**
$$ \text{真实价格} = \text{RawPrice} \times \frac{10^{\text{Token1的精度}}}{10^{\text{Token0的精度}}} $$

**简单记忆法：**
> **“缺多少补多少，谁精度大谁在分子上（如果是乘法补偿）”**。
> 或者更直观的物理意义：
> **真实价格 = (Raw价格) * (分母Token的单位 / 分子Token的单位)**

**更新后的卡片建议：**

你可以把卡片背面那个公式改成更直观的文字描述：

**背面 (Back):**
> 1.  先除以 $2^{96}$ 再平方，得到 **链上原始价格 ($P_{raw}$)**。
> 2.  **核心修正**: 因为 Token0 和 Token1 的精度 (Decimals) 不同，链上数字的数量级是错的。
> 3.  **公式**:
>     $$ P_{actual} = P_{raw} \times 10^{(\text{Token0精度} - \text{Token1精度})} $$
>     *(假设计算的是 Token0 对 Token1 的价格)*
>
> **例子**:
> ETH(18位) / USDC(6位)。
> 链上数 ETH 很大，导致 $P_{raw}$ 极小。
> 需要乘以 $10^{(18-6)} = 10^{12}$ 才能还原成真实价格。