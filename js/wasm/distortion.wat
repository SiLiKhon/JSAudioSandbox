(module
    (import "js" "mem" (memory 1))
    (func (export "distort")
          (param $threshold f32)
          (param $bufLen i32)
          (local $i i32)
        (local.set $i (i32.const 0)) ;; i = 0
        (local.set $bufLen (i32.mul (local.get $bufLen) (i32.const 4))) ;; bufLen *= 4
        loop $samplesLoop
            (f32.store (
                i32.add (local.get $i) (local.get $bufLen)
            ) ( ;; mem[i + bufLen] =
                if (result f32) (
                    f32.gt (f32.abs (f32.load (local.get $i))) (local.get $threshold) ;; (abs(mem[i]) > threshold)
                ) (
                    then (f32.copysign (local.get $threshold) (f32.load (local.get $i))) ;; threshold * sign(mem[i])
                ) (
                    else (f32.load (local.get $i)) ;; mem[i]
                )
            ))

            (local.set $i (i32.add (local.get $i) (i32.const 4))) ;; i += 4

            (i32.gt_s (local.get $bufLen) (local.get $i)) ;; bufLen > i
            br_if $samplesLoop
        end
    )
)