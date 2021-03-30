/**
 * Returns a target matching the specified criteria or null if none could be found.
 * 
 * args:
 *  - monsterTypeLimit: An array of string (e.g.: ["goo", "bee"]) that limits the targeted monsters to given type
 *  - rangeLimit: Search range limit in pixels (default: 200)
 */
function loader_base_target_nearest_monster(args)
{
    let rangeLimit = (args.rangeLimit ? args.rangeLimit : 200);

    // Select the nearest monster attacking the player
    let target = get_nearest_monster({target:character});

    // If no monster attacks the player just pick the closest or the closest of type monsterTypeLimit
    if (!target) {
        if (args.monsterTypeLimit) {
            for (let idx = 0; idx < args.monsterTypeLimit.length; idx++) {
                target = get_nearest_monster({type:args.monsterTypeLimit[idx]});
                if (target) break;
            }
        } else {
            target = get_nearest_monster();
        }
    }

    // Check if target is close enough
    if (distance(character, target) > rangeLimit) {
        return;
    }

    return (target ? target : null);
}
