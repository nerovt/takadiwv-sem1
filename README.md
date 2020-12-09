# Links
### Heroku
https://eauction-site.herokuapp.com/

### (Regular) Github link
https://github.com/nerovt/takadiwv-sem1

# Auction

An auction site where users can upload details of items they no longer want and bid for things they want. All the items for sale need to be stored in a database.

---

## Testing

The system should include the data for at least 5 items for sale for each registered `seller`. These items should include realistic details including photos. The customer details should also be valid.

You are required to create the following accounts to allow the system to be tested. All accounts should have the password `p455w0rd`:

1. `seller1`
2. `seller2`

---

## Stage 1

The core functionality consists of three screens

### Part 1

The home page, which should be visible without logging in, should display all the items that other `sellers` want to sell. If a `seller` is logged in it should **not** display their own items. Each item displayed should include:

1. The name of the item.
2. A thumbnail image.
3. A status, one of the following:
    1. for sale.
    2. under offer.
    3. sold.
4. The name and phone number of the seller.

### Part 2

When a `seller` is logged in there should be a link on the **home page** to their **selling page** which should list all the items they have for sale. This page must not be accessible if the user is not logged in and they must not be able to see the selling page of other users! The selling page should include:

1. The name of the item
2. A thumbnail image
3. The status (note: this is not changeable).
4. The option to delete items.