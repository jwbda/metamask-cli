// SPDX-License-Identifier: MIT
/**
 * discritions: 在uniswap上通过闪电贷，完成一次3方交易。即借出USDT - 换取USDC --还回WETH
 */
pragma solidity ^0.8.24;
// import "./IERC20.sol";
import "hardhat/console.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}
interface pair {
    function swap(
        uint amount0Out,
        uint amount1Out,
        address to,
        bytes calldata data
    ) external;
}
interface uniRouter {
    function swapExactTokensForTokens(
        uint amountIn, // 交换多少
        uint amountOutMin, // 最少交换多少
        address[] calldata path, // 交易路径
        address to, // to地址
        uint deadline
    ) external returns (uint[] memory amounts);
    function getAmountsIn(
        // getAmountsIn 返回该还多少钱
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}
interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}
contract FlashLoan {
    address public router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public USDTETH = 0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852;
    address public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    uint256 public loanAmount;
    uint256 public ETHAmount;
    bytes _data = bytes("Flashloan");
    event Balance(uint256 amount);
    constructor() public {
        console.log(">>> run in constructor > ", type(uint).max);
        safeApprove(WETH, router, type(uint).max);
        safeApprove(USDT, router, type(uint).max);
        safeApprove(USDC, router, type(uint).max);
    }
    function deposit() public payable {
        ETHAmount = msg.value;
        // IWETH(WETH).deposit.value(ETHAmount)();
        IWETH(WETH).deposit{value: ETHAmount}();
        emit Balance(IERC20(WETH).balanceOf(address(this)));
    }
    // uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
    function uniswapV2Call(
        address account,
        uint256 amount0,
        uint256 amount1,
        bytes memory data
    ) public {
        uint256 balance = IERC20(USDT).balanceOf(address(this)); // USDT 有多少
        emit Balance(balance);
        address[] memory path1 = new address[](2);

        // 使用 USDT 换 USDC
        path1[0] = USDT;
        path1[1] = USDC;
        uint[] memory amounts1 = uniRouter(router).swapExactTokensForTokens(
            balance, //
            uint(0),
            path1,
            address(this),
            block.timestamp + 1800
        );
        emit Balance(amounts1[1]);
        address[] memory path2 = new address[](2);
        path2[0] = USDC;
        path2[1] = WETH;
        uint[] memory amounts2 = uniRouter(router).swapExactTokensForTokens(
            amounts1[1], // ?
            uint(0),
            path2,
            address(this),
            block.timestamp + 1800
        );

        // 开始还账
        emit Balance(amounts2[1]);
        address[] memory path3 = new address[](2);
        path3[0] = WETH;
        path3[1] = USDT;
        uint[] memory amounts3 = uniRouter(router).getAmountsIn(
            loanAmount,
            path3
        );
        emit Balance(amounts3[0]);
        IERC20(WETH).transfer(USDTETH, amounts3[0]);
        emit Balance(ETHAmount - amounts3[0]);
    }
    function swap(uint256 _loanAmount) public {
        loanAmount = _loanAmount;
        pair(USDTETH).swap(uint(0), loanAmount, address(this), _data);
    }
    function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(0x095ea7b3, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TransferHelper: APPROVE_FAILED"
        );
    }
}
