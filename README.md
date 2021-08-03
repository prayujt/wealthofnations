# Wealth of Nations

## Get started

Install the dependencies...

```bash
cd wealthofnations
npm install
cd client
npm install
```

...then start the game

```bash
npm run start
```

Navigate to [localhost:2000](http://localhost:2000). You should see your app running.

## Game Manual

---

### Objective

There are two game modes in Wealth of Nations: Last Man Standing and Timed.

In Last Man Standing mode, the objective of the game is to force all other players into bankruptcy.

In Timed mode, the objective is to be the company with the most value by the end of a set amount of turns decided by the player.

### Gameplay Mechanics

#### Companies

<br>
Companies are the most basic unit of income in the game. Each company has a tag that attributes it to a sector in the domestic market (eg. Oil, Consumer Goods). Company performance is shown through the company's stock price, which is explained in the Stock Market section.

Each company has their own balance sheet generated at the end of each turn, where their revenue and expenses are listed out.

##### Expenses

Company expenses will consist of 3 parts: employee wages, executive wages, and general maintenance fees. The wage for each employee per quarter is a fixed amount, but the total expense will be dependent on the number of employees hired. On the other hand, executive wages are a fixed amount, with a wage that is triple the employee wage, and a fixed number of executive employees. Maintenance fees will be another expense that is a fixed percentage of the company's net worth.

##### Revenue

During each turn, there will be a randomly generated revenue growth percentage that shows what the company expects the revenue growth for the quarter to be. However, there will be a volatility factor that grows smaller the larger the company size is, which can add or subtract to the company's expected revenue growth. When the net expenses are subtracted from this new revenue number that includes the volatility adjustment, the net profit of the company is reached. If the net profit is negative, then the stock price will go down, and if the net profit is positive, then the stock price will go up. If the net profit is close to zero, then the stock price will only change by anywhere from -1% to 1%. Note that with this model, the expected profit from the public that operates in the stock market is $0.

##### Company Actions

When a player becomes a majority shareholder in the company, the player is appointed the CEO of the company. The CEO is a part of the executive employees group, and will have his wage included in that group. His wage is higher than the rest of the executives' wages, and can be changed by the company

#### Cities

<br>
Cities are the

#### Players

#### Stock Market

#### Muslims and Pirates
