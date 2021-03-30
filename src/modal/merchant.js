function addMerchantButtons()
{
    add_bottom_button('giveToMerchant1', 'Give 1', () => {
        // Check if a merchant has been set
        let merchant = localStorage.getItem('loader_merchant');
        if (!merchant) {
            log('No merchant has been set!');
            return;
        }

        send_item(merchant, 41, 1);
        setTimeout(() => {
            if (character.items[41] === null) {
                swap(40, 41);
                swap(39, 40);
                swap(38, 39);
                swap(37, 38);
                swap(36, 37);
                swap(35, 36);
            }
        }, 250);
    });
    add_bottom_button('giveToMerchant10', 'Give 10', () => {
        // Check if a merchant has been set
        let merchant = localStorage.getItem('loader_merchant');
        if (!merchant) {
            log('No merchant has been set!');
            return;
        }

        send_item(merchant, 41, 10);
        if (character.items[41] !== null) {
            setTimeout(() => {
                if (character.items[41] === null) {
                    swap(40, 41);
                    swap(39, 40);
                    swap(38, 39);
                    swap(37, 38);
                    swap(36, 37);
                    swap(35, 36);
                }
            }, 250);
        }
    });
}
