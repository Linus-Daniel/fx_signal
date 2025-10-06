// File: src/services/signalCopyService.ts

import { Signal } from "../components/SignalCard";

export interface TradingAccount {
  id: string;
  broker: string;
  accountNumber: string;
  balance: number;
  currency: string;
  leverage: number;
  apiKey?: string;
  apiSecret?: string;
}

export interface CopySettings {
  riskPercentage: number; // % of account balance to risk per trade
  maxPositionSize: number; // Maximum lot size
  useStopLoss: boolean;
  useTakeProfit: boolean;
  trailStopLoss?: boolean;
  multiplier: number; // Signal multiplier (e.g., 0.5 = half size, 2 = double size)
}

export interface CopiedTrade {
  id: string;
  signalId: string;
  accountId: string;
  currencyPair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  status: "pending" | "open" | "closed";
  openTime: Date;
  closeTime?: Date;
  profit?: number;
  pips?: number;
}

export class SignalCopyService {
  /**
   * Main algorithm to copy a signal to a trading account
   */
  static async copySignal(
    signal: Signal,
    account: TradingAccount,
    settings: CopySettings
  ): Promise<CopiedTrade> {
    try {
      // Step 1: Validate signal and account
      this.validateSignal(signal);
      this.validateAccount(account);

      // Step 2: Calculate position size based on risk management
      const lotSize = this.calculateLotSize(signal, account, settings);

      // Step 3: Adjust price levels based on settings
      const adjustedLevels = this.adjustPriceLevels(signal, settings);

      // Step 4: Create trade order
      const trade = await this.executeTradeOrder({
        signal,
        account,
        lotSize,
        ...adjustedLevels,
      });

      // Step 5: Set up monitoring and alerts
      await this.setupTradeMonitoring(trade);

      return trade;
    } catch (error) {
      console.error("Failed to copy signal:", error);
      throw error;
    }
  }

  /**
   * Calculate optimal lot size based on risk management rules
   */
  private static calculateLotSize(
    signal: Signal,
    account: TradingAccount,
    settings: CopySettings
  ): number {
    // Calculate risk amount in account currency
    const riskAmount = (account.balance * settings.riskPercentage) / 100;

    // Calculate pip value (for standard lot)
    // This is simplified - real implementation would vary by currency pair
    const pipValue = this.calculatePipValue(
      signal.currencyPair,
      account.currency
    );

    // Calculate stop loss distance in pips
    const stopLossPips = signal.stopLoss
      ? Math.abs(signal.entryPrice - signal.stopLoss) * 10000
      : 50; // Default 50 pips if no SL

    // Calculate lot size: Risk Amount / (Stop Loss in Pips × Pip Value)
    let lotSize = riskAmount / (stopLossPips * pipValue);

    // Apply signal multiplier
    lotSize *= settings.multiplier;

    // Ensure lot size doesn't exceed max position size
    lotSize = Math.min(lotSize, settings.maxPositionSize);

    // Round to valid lot sizes (0.01, 0.1, 1.0, etc.)
    lotSize = this.roundToValidLotSize(lotSize);

    // Ensure minimum lot size (usually 0.01)
    lotSize = Math.max(lotSize, 0.01);

    return lotSize;
  }

  /**
   * Calculate pip value for a currency pair
   */
  private static calculatePipValue(
    currencyPair: string,
    accountCurrency: string
  ): number {
    // Simplified calculation - real implementation would use current exchange rates
    const [base, quote] = currencyPair.split("/");

    // For JPY pairs, pip is 0.01, for others 0.0001
    const isJPYPair = quote === "JPY";
    const pipSize = isJPYPair ? 0.01 : 0.0001;

    // Standard lot = 100,000 units
    const standardLot = 100000;

    // Pip value = (Pip Size × Standard Lot)
    let pipValue = pipSize * standardLot;

    // If quote currency is not account currency, we'd need conversion
    // This is simplified - production code would fetch real-time rates
    if (quote !== accountCurrency) {
      // Use approximate conversion rates
      const conversionRates: { [key: string]: number } = {
        "USD/EUR": 0.92,
        "USD/GBP": 0.79,
        "EUR/USD": 1.09,
        "GBP/USD": 1.27,
      };
      const conversionKey = `${quote}/${accountCurrency}`;
      const rate = conversionRates[conversionKey] || 1;
      pipValue *= rate;
    }

    return pipValue;
  }

  /**
   * Round lot size to valid increments
   */
  private static roundToValidLotSize(lotSize: number): number {
    // Most brokers allow: 0.01, 0.02, ... 0.1, 0.2, ... 1.0, 2.0, etc.
    if (lotSize < 0.1) {
      return Math.round(lotSize * 100) / 100; // Round to 0.01
    } else if (lotSize < 1) {
      return Math.round(lotSize * 10) / 10; // Round to 0.1
    } else {
      return Math.round(lotSize * 10) / 10; // Round to 0.1
    }
  }

  /**
   * Adjust price levels based on copy settings
   */
  private static adjustPriceLevels(
    signal: Signal,
    settings: CopySettings
  ): {
    entryPrice: number;
    stopLoss?: number;
    takeProfit?: number;
  } {
    const levels = {
      entryPrice: signal.entryPrice,
      stopLoss: settings.useStopLoss ? signal.stopLoss : undefined,
      takeProfit: settings.useTakeProfit ? signal.takeProfit : undefined,
    };

    // Add slippage protection (typically 2-3 pips)
    const slippage = 0.0003; // 3 pips for most pairs

    if (signal.signalType === "BUY") {
      levels.entryPrice += slippage;
    } else {
      levels.entryPrice -= slippage;
    }

    return levels;
  }

  /**
   * Execute the actual trade order
   */
  private static async executeTradeOrder(params: {
    signal: Signal;
    account: TradingAccount;
    lotSize: number;
    entryPrice: number;
    stopLoss?: number;
    takeProfit?: number;
  }): Promise<CopiedTrade> {
    // In production, this would make API calls to broker
    // For now, we'll simulate the trade creation

    const trade: CopiedTrade = {
      id: `trade_${Date.now()}`,
      signalId: params.signal.id,
      accountId: params.account.id,
      currencyPair: params.signal.currencyPair,
      direction: params.signal.signalType,
      entryPrice: params.entryPrice,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
      lotSize: params.lotSize,
      status: "pending",
      openTime: new Date(),
    };

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, you would:
    // 1. Connect to broker API (MetaTrader, cTrader, etc.)
    // 2. Send order request with parameters
    // 3. Handle order confirmation
    // 4. Store trade in database
    // 5. Set up webhooks for trade updates

    // Example API call structure:
    /*
    const response = await fetch(`${account.broker}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: params.signal.currencyPair,
        type: params.signal.signalType === 'BUY' ? 'MARKET_BUY' : 'MARKET_SELL',
        volume: params.lotSize,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        comment: `Signal_${params.signal.id}`,
      }),
    });

    const result = await response.json();
    trade.id = result.orderId;
    */

    trade.status = "open";
    return trade;
  }

  /**
   * Set up monitoring for the copied trade
   */
  private static async setupTradeMonitoring(trade: CopiedTrade): Promise<void> {
    // In production, this would:
    // 1. Set up price alerts
    // 2. Monitor for stop loss/take profit hits
    // 3. Send notifications to user
    // 4. Update trade status in real-time
    // 5. Calculate running P&L

    console.log(`Monitoring set up for trade ${trade.id}`);
  }

  /**
   * Validate signal before copying
   */
  private static validateSignal(signal: Signal): void {
    if (signal.status !== "active") {
      throw new Error("Cannot copy inactive signal");
    }

    if (!signal.entryPrice || signal.entryPrice <= 0) {
      throw new Error("Invalid entry price");
    }

    if (signal.stopLoss && signal.takeProfit) {
      // Validate SL and TP are on correct sides of entry
      if (signal.signalType === "BUY") {
        if (signal.stopLoss >= signal.entryPrice) {
          throw new Error(
            "Stop loss must be below entry price for BUY signals"
          );
        }
        if (signal.takeProfit <= signal.entryPrice) {
          throw new Error(
            "Take profit must be above entry price for BUY signals"
          );
        }
      } else {
        if (signal.stopLoss <= signal.entryPrice) {
          throw new Error(
            "Stop loss must be above entry price for SELL signals"
          );
        }
        if (signal.takeProfit >= signal.entryPrice) {
          throw new Error(
            "Take profit must be below entry price for SELL signals"
          );
        }
      }
    }
  }

  /**
   * Validate trading account
   */
  private static validateAccount(account: TradingAccount): void {
    if (account.balance <= 0) {
      throw new Error("Insufficient account balance");
    }

    if (!account.apiKey || !account.apiSecret) {
      throw new Error("Account API credentials not configured");
    }
  }

  /**
   * Calculate potential profit/loss for a trade
   */
  static calculatePotentialPL(
    signal: Signal,
    lotSize: number,
    accountCurrency: string
  ): {
    potentialProfit: number;
    potentialLoss: number;
    riskRewardRatio: number;
  } {
    const pipValue = this.calculatePipValue(
      signal.currencyPair,
      accountCurrency
    );

    const profitPips = signal.takeProfit
      ? Math.abs(signal.takeProfit - signal.entryPrice) * 10000
      : 0;

    const lossPips = signal.stopLoss
      ? Math.abs(signal.entryPrice - signal.stopLoss) * 10000
      : 0;

    const potentialProfit = profitPips * pipValue * lotSize;
    const potentialLoss = lossPips * pipValue * lotSize;

    const riskRewardRatio = lossPips > 0 ? profitPips / lossPips : 0;

    return {
      potentialProfit,
      potentialLoss,
      riskRewardRatio,
    };
  }
}

// Default copy settings
export const DEFAULT_COPY_SETTINGS: CopySettings = {
  riskPercentage: 2, // Risk 2% per trade
  maxPositionSize: 1.0, // Max 1 standard lot
  useStopLoss: true,
  useTakeProfit: true,
  trailStopLoss: false,
  multiplier: 1.0,
};
