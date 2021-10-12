(ns ant-colony.antFood
  (:require [ant-colony.antProperties :as Properties]))

; calculating the attractiveness for each edge
; (simply by inverting the value so that the shortest path has the biggest attractiveness)
(def attractiveness (mapv (fn [x] (mapv (fn [y] (if (> y 0) (/ 1 y) 0)) x)) Properties/edges))

(defn getPath [step sum probabilities probability]
  "Gets the a random path from the current set of possible edges according to ACO"
  (if (> sum probability)
    step
    (recur (inc step) (+ sum (probabilities (inc step))) probabilities probability)
    )
  )

(defn generateSolution [ant pheromones]
  "Function that generates the next path for a given ant with given pheromones trails."
  (println pheromones)
  (let [pheromoneVector (pheromones (ant :position))
        attractivenessVector (attractiveness (ant :position))
        divisor (reduce + (map-indexed (fn [i x] (* x (pheromoneVector i))) (attractiveness (ant :position))))
        probabilities (into [] (map-indexed
                                 (fn [i x] (/ (* x (pheromoneVector i)) divisor))
                                 attractivenessVector))
        ]
    (getPath 0 (probabilities 0) probabilities (rand))
    )
  )

(defn updateAnt [ant]
  "Function that decides whether a given ant changes its directive (aka reached its goal) or not."
  (if (= (ant :goal) (ant :position))
    (assoc ant :shouldSprayPheromones true)
    ant
    )
  )

(defn prepare []
  "Function that prepares the problem and packages it so that the core can execute it."
  [@Properties/antList Properties/edges @Properties/pheromones generateSolution updateAnt]
)