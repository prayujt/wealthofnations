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

#### Starting the Game

Each player starts the game at a randomly chosen small city around the map, with a conglomerate associated with their player (100% owned by the player) through which they buy other companies. They start off with $_insert amount_ of money and 0 influence. This conglomerate starts off as a private company, but once the company reaches a certain net worth, they must commit to an Initial Public Offering (IPO). This conglomerate will have the option to do the IPO at any time earlier as well.

#### Companies

<br>
Companies are the most basic unit of income in the game. Each company has a tag that attributes it to a sector in the domestic market (eg. Oil, Consumer Goods). Company performance is shown through the company's stock price, which is explained in the Stock Market section.

Each company has their own balance sheet generated at the end of each turn, where their revenue and expenses are listed out.
Each company also may come with one or more secrets that, if found out by the public, would negatively impact the company. Not all companies will have such a secret. This secret cannot be removed or changed in any way, and must instead be prevented from being exposed.
As a company gets larger, they may acquire more secrets.

##### Expenses

Company expenses will consist of 5 parts: employee wages, executive wages, general maintenance fees, interest payments on debt, and local taxes. The wage for each employee per quarter is a fixed amount, but the total expense will be dependent on the number of employees hired. On the other hand, executive wages are a fixed amount, with a wage that is triple the employee wage, and a fixed number of executive employees. Maintenance fees will be another expense that is a fixed percentage of the company's net worth. Interest payments will be set at a global interest rate used by the bank. Players have the option to pay off company debts using their own funds by transfering their money to the company's bank account. Local taxes are always paid, regardless of the lack of a player in control of the city.

##### Revenue

During each turn, there will be a generated revenue growth percentage that shows what the company expects the revenue growth for the quarter to be. However, there will be a volatility factor that grows smaller the larger the company size is, which can add or subtract to the company's expected revenue growth. When the net expenses are subtracted from this new revenue number that includes the volatility adjustment, the net profit of the company is reached. If the net profit is negative, then the stock price will go down, and if the net profit is positive, then the stock price will go up. If the net profit is close to zero, then the stock price will only change by anywhere from -1% to 1%. Note that with this model, the expected profit from the public that operates in the stock market is $0. Excess profit is given to the company CEO, and losses will be incurred by the CEO as well. Stock price movements are also slightly adjusted by general trends within the market, such as a bull or bear market. Revenue is the method by which companies succeed or fail, since expenses are largely fixed.

##### Control over Companies

When a player becomes a majority shareholder in the company, the player is appointed the CEO of the company. The CEO is a part of the executive employees group, and will have his wage included in that group. His wage is higher than the rest of the executives' wages, and includes all extra profit made by the company (or losses). Being CEO also unlocks the option of performing company actions. These include abilities such as selecting the CEO compensation that you receive (keep in mind that this could harm your company's stock price next turn by increasing expenses), declaring bankruptcy, using your own money to hire more employees (or poach from other companies) to stimulate company growth, and much more.

##### Company Bankruptcy

If a player is incurring large losses as a result of owning a company, they can choose for the company to declare bankruptcy, in which they recieve 30% of the current market value of the shares. If a random event negatively affects a company that the player does not own a majority stake in, then regardless of the severity of the event, the bank will always choose to declare bankruptcy.

#### Cities

<br>
Cities are made up of the several companies that are headquartered there. Cities with smaller populations will have a smaller number of companies present, and vice-versa, with the number of companies ranging from 5-50.

##### Control of Cities

When a player owns 51% of the market capitalization of the companies within the city, the player is in control of the city. This allows the player to collect taxes from both the population within the city, and the companies within the city. This also unlocks city actions, which include:

#### Stock Market

Each player will have access to an interface that allows them to purchase and sell shares of companies that they have visibility of. They can only view information and receive quotes on the stocks of companies that they do not yet have visibility on. The stock market itself has general trends that are randomly determined.

#### Hostile Entities

##### Muslims and Pirates

Players have the option to hire foreigners to infiltrate enemy companies and affect their performance. The impact that this has on enemy companies is fixed. However, the chance of success is based upon your own influence levels. If you are caught, and the hit job fails, then the impact that this has on your own companies' revenue is greater the more influence you have.

##### Bribery

When an enemy owns a majority stake in another company, that company's board of directors can be _persuaded_ to replace the enemy as CEO. This would require a substantial amount of money, well over the market value of the company, to bribe enough board members to vote the enemy out and replace you as CEO. This results in you purchasing the entire stake that the enemy owned, with the excess going to the bank.

##### Private Investigations

A player has the ability to hire a private investigator to dig up dirt upon a company to uncover a secret that the company is hiding. This guarantees the revelation of a secret, if the company has one. If not, then nothing happens. The revelation of a secret would have an impact on the company's revenue, the extent of which would depend on the severity of the secret.

#### Random Events

Random events, although rare, can decide a company's fate. Random events can influence activities in 3 different scopes: companies, sectors, or globally. A random event focused on a company would be in the form of a revelation about a company secret. A random event focused on a sector would involve a change in the supply or demand for a sector's goods or services, such as a Saudi Oil tanker being bombed by Iranians. A global random event would be on the scale of the Great Depression or Great Recession.

#### Player Bankruptcy

In the Timed game mode, there is an option to declare bankruptcy upon incurring significant debts that you are unable to pay back. This gives you the ability to restart. All companies owned get sold to the bank, and the conglomerate is dissolved. Your player restarts with a new conglomerate, in the same fashion as when the game started.

In the Last Man Standing game mode, player bankruptcy is automatically declared when a player's net worth reaches $0. This eliminates them from the game.

## TODO

- Add ability to take over enemy conglomerate in order to eliminate them from the game. This option should only be available when the enemy
- Add spawning of new companies as cities grow
