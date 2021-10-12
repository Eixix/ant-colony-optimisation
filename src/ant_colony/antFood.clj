(ns ant-colony.antFood
  (:require [ant-colony.antProperties :as Properties])
  (:require [ant-colony.util :as Util]))

(defn getAttractivenessVector [edges position alreadyVisited]
  (mapv (fn [x] (if (> x 0) (/ 1 x) 0)) (into [] (map-indexed (fn [i x] (if (.contains alreadyVisited i)
                                                                          (* x @Properties/fixCoefficient)
                                                                          x
                                                                          )) (edges position))))
  )

(defn generateSolution [ant edges pheromones]
  "Function that generates the next path for a given ant with given pheromones trails."
  (let [pheromoneVector (pheromones (ant :position))
        attractivenessVector (getAttractivenessVector edges (ant :position) (ant :alreadyVisited))
        divisor (reduce + (map-indexed (fn [i x] (* x (pheromoneVector i))) attractivenessVector))
        probabilities (into [] (map-indexed
                                 (fn [i x] (/ (* x (pheromoneVector i)) divisor))
                                 attractivenessVector))
        ]
    (Util/getPath 0 (probabilities 0) probabilities (rand))
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
  [@Properties/antList (into [] (map-indexed (fn [i x] (into [] (map-indexed (fn [j y] (if (= i j) 0 y)) x))) Properties/edges)) @Properties/pheromones generateSolution updateAnt]
)