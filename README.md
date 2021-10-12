# 1. Change Graph and Algorithm

To change the graph change the variable edges in `src/ant_colony/antProperties.clj`. To change the algorithm (either antFood or TSP), uncomment the corresponding line (either 4 or 5) in `src/ant_colony/core.clj`

# 2. Execution

After cloning the from inside the project directory

## With Docker

```bash
docker build -t ant-colony:latest .
docker run -p 3000:3000 ant-colony:latest
```

## With Leiningen

```bash
lein run
```

# 3. Start visualization

Just open `public/index.html`

# Presentation about the ACO

There is a short presentation about the [algorithm here](https://docs.google.com/presentation/d/1_kW2Cb44ZfmGrwZnz-aqeUiy831jcnQwMjvLcjtQIVA/edit?usp=sharing)
