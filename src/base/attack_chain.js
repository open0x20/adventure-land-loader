/**
 * Chains attacks with setTimeout() and the attack cooldown.
 * The chain stops after a new target or no target has been selected.
 */
function loader_base_attack_chain(targetId)
{
    let target = get_targeted_monster();

    if (!target) {
        return;
    }

    // If targets changed stop this loop
    if (target.id !== targetId) {
        return;
    }

    let timeout = (parent.next_skill['attack'] - new Date()) + character.ping * 0.95;
    if (timeout < 0) {
        timeout = 0;
    }

    if (timeout === 0) {
        if (is_in_range(target, 'attack')) {
            attack(target).then( 
                function(data) {
                    // attack succeeded
                    reduce_cooldown('attack', character.ping * 0.95);
                },
                function(data) {
                    // attack failed
                    log('failed to attack: ' + targetId + ' (' + data.reason + ')');
                }
            );
    
            timeout = 1000 / character.frequency;
        } else {
            timeout = 100;
        }
    }

    setTimeout(function() {
        loader_base_attack_chain(targetId);
    }, timeout);
}
