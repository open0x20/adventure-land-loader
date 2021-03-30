/**
 * Simple auto- targeting and attacking behaviour.
 */
class AutoAttackBehaviour
{
    engage()
    {
        let allowed_monsters = localStorage.getItem('loader_allowed_monsters') || null;

        if (allowed_monsters) {
            allowed_monsters = allowed_monsters.split(',');
        }

        loader_loops_targeting_loop({
            interval: 1000,
            onTargetFoundCallback: loader_base_attack_chain,
            targetingArgs: {
                monsterTypeLimit: allowed_monsters,
                rangeLimit: 200
            }
        });

        loader_loops_healing_loop({
            interval: 500
        });

        loader_loops_move_into_range({
            interval: 200
        });
    }
}
