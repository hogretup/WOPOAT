# Contains SymPy scripts

from sympy import *
import string
import random

# ---------------- Quiz generators ----------------
"""
Input: difficulty = 1,2,3, n = number of questions

For each difficulty level, we check for certain filters
to determine complexity of the expression, and keep
generating until a suitable one is found.

Example output: (Dict)
{
  "statement": "Expand the following expression",
  "qns": [
    {
      "qn": "b \\left(r - 1\\right)",
      "options": [
        "b r - b",
        "b r - b",
        "b r - 2 b",
        "b r - 3 b"
      ],
      "correct": 0
    },
    {
      "qn": "- 6 m \\left(g - 1\\right)",
      "options": [
        "- 4 g m + 4 m",
        "- 8 g m + 8 m",
        "- 7 g m + 7 m",
        "- 6 g m + 6 m"
      ],
      "correct": 3
    }
  ]
}
"""


def generate_expandquiz(difficulty, n):
    """
    Generates a random "Expand" quiz with n questions,
    with 4 options per qn, each qn as a LaTeX string 
    (with escaped backslashes) and returned as a dict
    """
    qns = []
    for i in range(n):
        expr = ''
        if difficulty == 1:
            """
            height = 2, numvars = 2, degree <= 1
            """
            while True:
                redo = False
                expr = random_expression(2, 2)
                if expand(expr) == expr:
                    redo = True
                if get_degree(expr) > 1:
                    redo = True
                """
                if has_product_terms(expr):
                    redo = True
                """
                if not redo:
                    break
        elif difficulty == 2:
            """
            height = 3, numvars = 2, degree <= 2
            """
            while True:
                redo = False
                expr = random_expression(3, 2)
                if expand(expr) == expr:
                    redo = True
                if get_degree(expr) > 2:
                    redo = True
                if not redo:
                    break
        elif difficulty == 3:
            """
            height = 4, numvars = 3, degree <= 3
            """
            while True:
                redo = False
                expr = random_expression(4, 3)
                if expand(expr) == expr:
                    redo = True
                if get_degree(expr) > 3:
                    redo = True
                if not redo:
                    break
        qns.append(expr)

    # Generating options and JSON output
    statement = "Expand the following expression"
    d = {}
    d["statement"] = statement
    d["qns"] = []
    for qn in qns:
        options, correct = random_options(expand(qn), 3)
        options = [latex(expr) for expr in options]
        d["qns"].append(
            {"qn": latex(qn), "options": options, "correct": correct})
    return d

# ---------------- Utility functions ----------------


def generate_random_symbols(n):
    """
    Returns n random sympy symbols.
    """
    alphabet = string.ascii_lowercase
    chars = random.sample(alphabet, n)
    return symbols(' '.join(chars))


def random_expression(height, numvars, ops=[Add, Mul]):
    """
    Generates a complete binary expression tree, with each node being a random
    sympy binary operator, and the leaves being either constants/symbols. The
    complexity of the resulting expression will roughly correspond to the height 
    of the tree. The number of distinct variables is numvars.

    Returns: A random SymPy expression
    """

    # Get random tuple of symbols
    symbols = generate_random_symbols(numvars)

    # Generate complete binary expression tree, with leaves being
    # a random symbol/constant
    def tree(height):
        if (height == 0):
            return randterminal()
        # Every node is a random operation
        return random.choice(ops)(tree(height-1), tree(height-1))

    # Function to generate a symbol/constant at random (can tweak probabilities)
    def randterminal():
        # Probability of picking constant
        p = 0.5
        if random.random() < p:
            return random.randint(-9, 9)
        else:
            return random.choice(symbols)

    return tree(height)


def random_options(expr, n):
    """
    Given an expression, generates n random options
    similar to the expression. A random option is generated
    by randomly changing the constants in expr by +-r.
    Radius of difference r may be tweaked.

    Returns: An array of (n+1) SymPy options, and the index
    of the correct option
    """
    r = 2
    while True:
        options = [expr]*n
        for num in expr.atoms(Number):
            # Loops through all the constant terms
            for i, option in enumerate(options):
                # Change constant to constant +- r (but not 0)
                newconstant = 0
                while newconstant == 0:
                    newconstant = num+random.randint(-1*r, r)
                options[i] = option.subs(num, newconstant)
            # Check if any pairs of options are (structurally) equivalent
            # as we want n distinct options
        distinct = True
        for i in range(0, n):
            for j in range(i+1, n):
                if (options[i] == options[j]):
                    distinct = False
        if distinct:
            break

    options.append(expr)
    random.shuffle(options)
    return options, options.index(expr)


def get_degree(expr):
    """
    Returns degree of the polynomial expression
    (highest sum of exponents of its monomials)
    """
    if (expr.is_constant()):
        return 0
    return degree(Poly(expr))


def has_product_terms(expr):
    """
    Returns true if there are product terms like
    xy, xyz, yx^2, etc.
    We count the number of non-zero exponents in 
    each of the monomials in monom(). I.e. xy has
    2 non-zero exponents, but x has only 1.
    """
    if (expr.is_constant()):
        return 0
    for monom in Poly(expr).monoms():
        num_nonzero_exponents = len([e for e in monom if e != 0])
        if num_nonzero_exponents > 1:
            return True
    return False
