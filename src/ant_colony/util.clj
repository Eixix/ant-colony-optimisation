(ns ant-colony.util)

(defn mirrorMatrix [matrix]
  "Mirrors the upper triangle of a matrix so that a symmetric matrix is generated."
  (into [] (map-indexed (fn [i x] (into [] (map-indexed (fn [j y] (if (<= i j)
                                                                    y
                                                                    ((matrix j) i)
                                                                    )) x))) matrix))
  )

(defn getPath [step sum probabilities probability]
  "Gets the a random path from the current set of possible edges according to ACO"
  (if (> sum probability)
    step
    (recur (inc step) (+ sum (probabilities (inc step))) probabilities probability)
    )
  )
