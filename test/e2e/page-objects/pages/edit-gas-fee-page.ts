import { Driver } from '../../webdriver/driver';

class EditGasFeePage {
  private readonly driver: Driver;

  // Locators
  private readonly editGasFeeButton = '[data-testid="edit-gas-fee-button"]';
  private readonly gasOptionButtons = {
    high: '[data-testid="gas-option-high"]',
    medium: '[data-testid="gas-option-medium"]',
    low: '[data-testid="gas-option-low"]',
  };
  private readonly gasOptionLabels = {
    aggressive: '[data-testid="gas-option-label-aggressive"]',
    market: '[data-testid="gas-option-label-market"]',
    slow: '[data-testid="gas-option-label-slow"]',
  };
  private readonly lowGasFeeAlert = '[data-testid="low-gas-fee-alert"]';
  private readonly advancedGasFeeButton = '[data-testid="advanced-gas-fee-button"]';
  private readonly baseFeeInput = '[data-testid="base-fee-input"]';
  private readonly priorityFeeInput = '[data-testid="priority-fee-input"]';
  private readonly gasLimitInput = '[data-testid="gas-limit-input"]';
  private readonly saveButton = '[data-testid="save-button"]';

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async openEditGasFeePopover(): Promise<void> {
    console.log('Opening edit gas fee popover');
    try {
      await this.driver.clickElement(this.editGasFeeButton);
      console.log('Edit gas fee popover opened successfully');
    } catch (error) {
      console.error('Failed to open edit gas fee popover', error);
      throw new Error('Failed to open edit gas fee popover');
    }
  }

  async selectGasOption(option: 'high' | 'medium' | 'low'): Promise<void> {
    console.log(`Selecting ${option} gas option`);
    try {
      await this.driver.clickElement(this.gasOptionButtons[option]);
      console.log(`${option} gas option selected successfully`);
    } catch (error) {
      console.error(`Failed to select ${option} gas option`, error);
      throw new Error(`Failed to select ${option} gas option`);
    }
  }

  async waitForGasOptionLabel(label: 'Aggressive' | 'Market' | 'Slow'): Promise<void> {
    const labelSelector = this.gasOptionLabels[label.toLowerCase() as keyof typeof this.gasOptionLabels];
    console.log(`Waiting for ${label} gas option label`);
    try {
      await this.driver.waitForSelector(labelSelector);
      console.log(`${label} gas option label displayed successfully`);
    } catch (error) {
      console.error(`Failed to wait for ${label} gas option label`, error);
      throw new Error(`${label} gas option label not displayed`);
    }
  }

  async waitForLowGasFeeAlert(): Promise<void> {
    console.log('Waiting for low gas fee alert');
    try {
      await this.driver.waitForSelector(this.lowGasFeeAlert);
      console.log('Low gas fee alert displayed successfully');
    } catch (error) {
      console.error('Failed to wait for low gas fee alert', error);
      throw new Error('Low gas fee alert not displayed');
    }
  }

  async openAdvancedGasFeePopover(): Promise<void> {
    console.log('Opening advanced gas fee popover');
    try {
      await this.driver.clickElement(this.advancedGasFeeButton);
      console.log('Advanced gas fee popover opened successfully');
    } catch (error) {
      console.error('Failed to open advanced gas fee popover', error);
      throw new Error('Failed to open advanced gas fee popover');
    }
  }

  async setBaseFee(fee: string): Promise<void> {
    console.log(`Setting base fee to ${fee}`);
    try {
      await this.driver.fill(this.baseFeeInput, fee);
      console.log(`Base fee set to ${fee} successfully`);
    } catch (error) {
      console.error(`Failed to set base fee to ${fee}`, error);
      throw new Error(`Failed to set base fee to ${fee}`);
    }
  }

  async setPriorityFee(fee: string): Promise<void> {
    console.log(`Setting priority fee to ${fee}`);
    try {
      await this.driver.fill(this.priorityFeeInput, fee);
      console.log(`Priority fee set to ${fee} successfully`);
    } catch (error) {
      console.error(`Failed to set priority fee to ${fee}`, error);
      throw new Error(`Failed to set priority fee to ${fee}`);
    }
  }

  async editGasLimit(limit: string): Promise<void> {
    console.log(`Editing gas limit to ${limit}`);
    try {
      await this.driver.fill(this.gasLimitInput, limit);
      console.log(`Gas limit edited to ${limit} successfully`);
    } catch (error) {
      console.error(`Failed to edit gas limit to ${limit}`, error);
      throw new Error(`Failed to edit gas limit to ${limit}`);
    }
  }

  async saveChanges(): Promise<void> {
    console.log('Saving gas fee changes');
    try {
      await this.driver.clickElement(this.saveButton);
      console.log('Gas fee changes saved successfully');
    } catch (error) {
      console.error('Failed to save gas fee changes', error);
      throw new Error('Failed to save gas fee changes');
    }
  }

  async saveDefaultValues(): Promise<void> {
    console.log('Saving default gas fee values');
    try {
      await this.saveChanges();
      console.log('Default gas fee values saved successfully');
    } catch (error) {
      console.error('Failed to save default gas fee values', error);
      throw new Error('Failed to save default gas fee values');
    }
  }
}

export default EditGasFeePage;
