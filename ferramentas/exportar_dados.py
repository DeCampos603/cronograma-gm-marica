# -*- coding: utf-8 -*-
"""Exporta os dados do gerador para JSON — fonte única para o site."""
import os, io, json, datetime

_b = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gerar_gm.py")
exec(compile(io.open(_b, encoding="utf-8").read(), _b, "exec"), globals())

DEST = r"G:\Meu Drive\REPO\Cronograma-GM-Marica\docs\dados\plano.json"
os.makedirs(os.path.dirname(DEST), exist_ok=True)


def grade_serial(G):
    out = []
    for horario, dur, tipo, cells in G:
        out.append({"h": horario, "dur": dur, "tipo": tipo, "dias": list(cells)})
    return out


def cor_de(txt, tipo):
    bg, fg, bold = paint(txt, tipo)
    mat = None
    for m in ORDEM:
        if txt.startswith(m):
            mat = m
            break
    return {"bg": bg, "fg": fg, "bold": bold, "materia": mat}


dados = {
    "gerado_em": datetime.date.today().isoformat(),
    "aluno": "GM Maricá",
    "familias": {k: {"cor": v[0], "rotulo": v[1]} for k, v in FAM.items()},
    "materias": {m: {"familia": SUB[m][0], "barra": SUB[m][1], "tinta": SUB[m][2],
                     "tinta2": SUB[m][3], "texto": SUB[m][4]} for m in ORDEM},
    "ordem": ORDEM,
    "dias": DIAS,
    "marcos": [{"nome": n, "data": d.isoformat(), "tag": t, "acao": a} for n, d, t, a in MARCOS],
    "carga": [{"materia": m, "blocos": b, "horas": h, "onde": o} for m, b, h, o in CARGA],
    "fases": [{"nome": n, "periodo": p, "muda": mu, "porque": pq} for n, p, mu, pq, _, _ in FASES],
    "grade": grade_serial(GRID),
    "meses": [{"mes": mes, "fase": fase, "marco": marco,
               "itens": [{"materia": m, "conteudo": c, "meta": mt} for m, c, mt in itens]}
              for mes, fase, marco, itens in MESES],
    "topicos": [{"id": i, "materia": m, "unidade": u, "topico": t, "prova": p,
                 "prioridade": pr, "mes": ms}
                for i, (m, u, t, p, pr, ms) in enumerate(TOP, 1)],
    "taf": TAF,
}

# paleta de cada célula da grade, pré-calculada
for linha_serial, (horario, dur, tipo, cells) in zip(dados["grade"], GRID):
    linha_serial["cores"] = [cor_de(c, tipo) for c in cells]

io.open(DEST, "w", encoding="utf-8").write(json.dumps(dados, ensure_ascii=False, indent=1))
print("JSON ->", DEST)
print("  topicos:", len(dados["topicos"]), "| meses:", len(dados["meses"]),
      "| linhas de grade:", len(dados["grade"]), "| marcos:", len(dados["marcos"]))