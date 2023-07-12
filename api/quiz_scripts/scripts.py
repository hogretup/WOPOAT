from sympy import *
from . import serialization
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
  "seed": "OZSKUaJzf11",
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


def generate_quiz_from_seed(seed):
    """
    Given a quiz seed, returns the generated quiz
    """
    concatenated_preorders, topic, difficulty, num_qns = serialization.decode_seed_to_preorders(
        seed)

    if difficulty == 1:
        preorder_length = len(serialization.HEIGHT_TWO_STRUCT)
    else:
        preorder_length = len(serialization.HEIGHT_THREE_STRUCT)

    qns = []
    ptr = 0
    for i in range(0, num_qns):
        expr = parse_preorder_to_expression(
            concatenated_preorders[ptr:ptr+preorder_length])
        if topic == "e":
            qns.append(expr)
        elif topic == "f":
            qns.append(expand(expr))
        ptr += preorder_length

    # Generating options and JSON output
    statement = ''
    if topic == "Expand":
        statement = "Expand the following expression"
    elif topic == "Factorise":
        statement = "Factorise the following expression"
    d = {}
    d["statement"] = statement
    d["seed"] = seed
    d["qns"] = []
    for qn in qns:
        options, correct = random_options(
            expand(qn) if topic == "e" else factor(qn), 3)
        options = [latex(expr) for expr in options]
        d["qns"].append(
            {"qn": latex(qn), "options": options, "correct": correct})
    return d


def generate_quiz(topic, difficulty, n):
    """
    Generates a random "Expand" quiz with n questions,
    with 4 options per qn, each qn as a LaTeX string
    (with escaped backslashes) and returned as a dict.

    Each qn is paired with a base64 string, the unique seed
    which generates that qn (unique up to variable names)
    """
    qns = []
    concatenated_preorders = []
    for i in range(n):
        # each qn is paired with its preorder array
        expr = ''
        preorder = []
        if difficulty == 1:
            """
            height = 2, numvars = 2, degree <= 1
            """
            while True:
                redo = False
                expr, preorder = random_expression(2, 2)
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
                expr, preorder = random_expression(3, 2)
                if expand(expr) == expr:
                    redo = True
                if get_degree(expr) > 2:
                    redo = True
                if not redo:
                    break
        elif difficulty == 3:
            """
            height = 3, numvars = 3, degree <= 3
            """
            while True:
                redo = False
                expr, preorder = random_expression(4, 3)
                if expand(expr) == expr:
                    redo = True
                if get_degree(expr) > 3:
                    redo = True
                if not redo:
                    break
        if topic == "Expand":
            qns.append(expr)
        elif topic == "Factorise":
            qns.append(expand(expr))
        concatenated_preorders += preorder

    # Generating unique seed
    seed = serialization.encode_preorders_to_seed(
        concatenated_preorders, topic, difficulty, n)

    # Generating options and JSON output
    if topic == "Expand":
        statement = "Expand the following expression"
    elif topic == "Factorise":
        statement = "Factorise the following expression"
    d = {}
    d["statement"] = statement
    d["seed"] = seed
    d["qns"] = []
    for qn in qns:
        options, correct = random_options(
            expand(qn) if topic == "Expand" else factor(qn), 3)
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
    SymPy binary operator, and the leaves being either constants/symbols. The
    complexity of the resulting expression will roughly correspond to the height
    of the tree. The number of distinct variables is numvars.

    Returns: A random SymPy expression, paired with its preorder array
    """

    preorder = generate_random_preorder(height, numvars)

    return parse_preorder_to_expression(preorder), preorder


def randterminal(symbols):
    """
    Leaves can either be a variable, or any integer from -9 to 9 inclusive.
    Returns a random symbol (from 'a','b' or 'c') or constant at random (can tweak probabilities)
    """

    # Probability of picking constant
    p = 0.5
    if random.random() < p:
        return random.randint(-9, 9)
    else:
        return random.choice(symbols)


def generate_random_preorder(height, numvars):
    """
    Given height of tree and number of variables, returns the preorder traversal
    for a random complete expression tree, where internal nodes are operations
    and leaves are symbols/constants.
    """
    ops = ['+', 'x']
    preorder = []

    if numvars == 2:
        symbols = ['a', 'b']
    elif numvars == 3:
        symbols = ['a', 'b', 'c']

    if height == 2:
        struct = serialization.HEIGHT_TWO_STRUCT
    elif height == 3:
        struct = serialization.HEIGHT_THREE_STRUCT

    for node in struct:
        if node == 'I':  # internal node
            preorder.append(random.choice(ops))
        elif node == 'L':  # leaf
            preorder.append(randterminal(symbols))
    return preorder


def parse_preorder_to_expression(preorder, ops=[Add, Mul]):
    """
    Given a valid preorder traversal, and up to 2 binary operators,
    returns the associated SymPy expression.

    """
    # Generates 3 arbitrary variables
    arbitrary_symbols = generate_random_symbols(3)

    def recurse(preorder):
        if len(preorder) == 1:
            # Leaf is either 'a','b','c', or an integer from -9 to 9
            if preorder[0] == 'a':
                return arbitrary_symbols[0]
            elif preorder[0] == 'b':
                return arbitrary_symbols[1]
            elif preorder[0] == 'c':
                return arbitrary_symbols[2]
            else:
                return preorder[0]
        n = len(preorder)
        if preorder[0] == '+':
            op = ops[0]
        else:
            op = ops[1]

        return op(recurse(preorder[1:1+n//2]), recurse(preorder[1+n//2:]))

    return recurse(preorder)


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
