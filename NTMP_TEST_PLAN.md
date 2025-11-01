# Test Plan: NTMP Economic Model Validation

**Objective**: To validate the core economic principles of the Ngwenya True Market Protocol (NTMP) through a suite of simulations and integration tests. This plan focuses on ensuring the stability, fairness, and robustness of the economic model under various conditions, including stress and adversarial scenarios.

## 1. PIVC (Protocol Integrated Value Capture) Validation

**Goal**: Verify that the 5% PIVC is correctly and transparently applied to all relevant transactions and that the allocated funds are routed to their designated treasuries.

**Scenarios**:

1.  **Successful Transaction**: A standard transaction between two parties completes successfully.
    - _Expected Outcome_: 5% of the transaction value is deducted as PIVC. The recipient receives 95% of the value. The 5% is correctly allocated to the Operational & Growth Fund and the Universal Basic Opportunity Fund according to the defined split.
2.  **High-Volume Transactions**: Simulate a high volume of concurrent transactions.
    - _Expected Outcome_: The PIVC is correctly applied to all transactions without any race conditions or misallocations.
3.  **Zero-Value Transaction**: A transaction with a zero value is attempted.
    - _Expected Outcome_: No PIVC is applied.
4.  **Adversarial Scenario (PIVC Bypass)**: An attempt is made to execute a transaction that bypasses the PIVC mechanism.
    - _Expected Outcome_: The transaction is rejected by the protocol.

**Data Needed**:

-   Mock user accounts with balances.
-   Transaction data (sender, receiver, amount).
-   Treasury wallet addresses.

## 2. Two-Token Economic Model Validation

**Goal**: Ensure that the two-token model (AZR and a-Tokens) functions as intended, with AZR serving as the protocol currency and a-Tokens providing localized utility.

**Scenarios**:

1.  **AZR-to-a-Token Conversion**: A user converts AZR to an a-Token for a specific service.
    - _Expected Outcome_: The conversion rate is applied correctly, and the user receives the corresponding amount of the a-Token.
2.  **a-Token Utility**: A user spends an a-Token within its designated service.
    - _Expected Outcome_: The service is rendered, and the a-Token is consumed or transferred as expected.
3.  **a-Token-to-AZR Conversion**: A user converts an a-Token back to AZR.
    - _Expected Outcome_: The conversion rate is applied correctly, and the user receives the corresponding amount of AZR.

**Data Needed**:

-   Conversion rates for AZR to a-Tokens.
-   Mock service that accepts a-Tokens.

## 3. Causal Pricing Engine Validation

**Goal**: To test the functionality of the causal pricing engine and ensure that prices are determined by verifiable impact and utility.

**Scenarios**:

1.  **High-Impact Contribution**: A contribution is made that has a high positive impact on the system.
    - _Expected Outcome_: The pricing engine assigns a high value to the contribution, resulting in a higher price.
2.  **Low-Impact Contribution**: A contribution is made that has a low positive impact on the system.
    - _Expected Outcome_: The pricing engine assigns a low value to the contribution, resulting in a lower price.
3.  **No-Impact Contribution**: A contribution is made that has no impact on the system.
    - _Expected Outcome_: The pricing engine assigns a zero or near-zero value to the contribution.

**Data Needed**:

-   Sample contribution data with varying levels of impact.
-   Metrics for measuring impact and utility.

## 4. Forge & Mint Validation

**Goal**: To ensure that the Forge and Mint mechanisms function correctly, with the Forge creating tangible productive capacity and the Mint managing the monetary supply.

**Scenarios**:

1.  **Forge Asset Creation**: The Forge is triggered to create a new physical asset.
    - _Expected Outcome_: The asset is created, and its value is added to the system's productive capacity.
2.  **Mint Monetary Issuance**: The Mint is triggered to issue new currency.
    - _Expected Outcome_: The new currency is issued in a controlled manner, maintaining the backing of the currency.
3.  **Burn Mechanism**: The Mint is triggered to burn currency.
    - _Expected Outcome_: The currency is burned, reducing the monetary supply.

**Data Needed**:

-   Data on physical assets and their value.
-   Monetary policy rules for minting and burning currency.

## 5. Buy-and-Burn Mechanism Validation

**Goal**: Verify that the buy-and-burn mechanism is functioning correctly, using a portion of the PIVC to buy back and burn AZR tokens.

**Scenarios**:

1.  **Scheduled Buy-and-Burn**: The buy-and-burn mechanism is triggered at a scheduled interval.
    - _Expected Outcome_: The correct amount of AZR is bought back from the market and burned, reducing the total supply.
2.  **Manual Buy-and-Burn**: The buy-and-burn mechanism is triggered manually.
    - _Expected Outcome_: The specified amount of AZR is bought back and burned.

**Data Needed**:

-   PIVC treasury balance.
-   AZR market price data.

This test plan will be implemented in the `/tests` directory, with subdirectories for each of the above sections. The tests will be written in TypeScript using a testing framework such as Jest or Vitest.