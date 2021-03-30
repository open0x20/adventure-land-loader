/**
 * Simple auto- targeting and attacking behaviour.
 */
class AutoAttackBehaviour
{
    engage()
    {
        loader_loops_targeting_loop({
            interval: 1000,
            onTargetFoundCallback: loader_base_attack_chain,
            targetingArgs: {
                monsterTypeLimit: ['goo', 'bee'],
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