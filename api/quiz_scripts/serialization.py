from sympy import *
import base64

"""
Generates a random preorder traversal of a complete binary expression tree.
Currently only supports up to 2 binary operators (i.e. Add, Mul)

How the serialization works:
Given a preorder traversal like x,+,a,1,+,b,2 we can reconstruct the expression tree:
       x
     /   \
    +     +
   / \   / \
  a   1 b   2

which represents (a+1)(b+2).
Note that the internal nodes can only either be {+,x} so they require 1 bit.
If numvars=2, The leaves can take any value from [-9,9] or {a,b} (2 arbitrary vars),
in total 21 values require 5 bits.
When height=2, the preorder of the complete binary tree always looks like this:

I,I,L,L,I,L,L

where I represents an internal node, and L is a leaf. Thus we know exactly what each bit
represents in the expression tree. We can then concatenate the preorder traversals of
each question, and encode into base64, resulting in a short enough, unique seed for each
quiz. For convenience, the topic, number of questions, and difficulty are also appended
to the end of each seed.

An example of the whole process for a 1-qn quiz:

Suppose the question has preorder array 

['x','+','a',5,'x',6,'b']

All internal nodes are encoded into its 1-bit equivalent, and all leaves 
are encoded into its 5-bit equivalent:

[1,0,10011,01110,1,01111,10100] --> 10100110111010111110100

Binary string is then converted into base64:

10100110111010111110100 --> U3X0

Since topic is Expand ("e"), number of qns is 1 (0+1 = 1), and difficulty level is 1,
these 3 characters are appended, resulting in the final seed

U3X0e01

In general, a quiz with Q questions, with expression trees of height H, the seed generated
will have about Q*(2^H - 1/6) + 3 characters (rounded up).
"""

# ---------------- Serialization functions ----------------

# Structure of preorder traversals of height-2/height-3 complete binary trees
HEIGHT_TWO_STRUCT = ['I', 'I', 'L', 'L', 'I', 'L', 'L']
HEIGHT_THREE_STRUCT = ['I', 'I', 'I', 'L', 'L', 'I',
                       'L', 'L', 'I', 'I', 'L', 'L', 'I', 'L', 'L']

# Number of bits required to store preorder traversal of height-2/height-3 complete expression trees
HEIGHT_TWO_BITS = 1 * \
    HEIGHT_TWO_STRUCT.count('I') + 5*HEIGHT_TWO_STRUCT.count('L')
HEIGHT_THREE_BITS = 1 * \
    HEIGHT_THREE_STRUCT.count('I') + 5*HEIGHT_THREE_STRUCT.count('L')


def decode_5bit_to_leaf(num):
    """
    Leaves are represented as 5-bit integers (21 possibilities)
    Integers -9 to 9 are represented by 0 to 18
    19: 'a'
    20: 'b'
    21: 'c'
    """
    if num == 19:
        return 'a'
    elif num == 20:
        return 'b'
    elif num == 21:
        return 'c'
    else:
        return num-9


def decode_1bit_to_node(num):
    """
    Nodes are represented as one bit (2 possibilities)
    0: '+'
    1: 'x'
    """
    return '+' if num == 0 else 'x'


def encode_leaf_to_5bit(leaf):
    """
    Leaves are represented as 5-bit integers (21 possibilities)
    Integers -9 to 9 are represented by 0 to 18
    19: 'a'
    20: 'b'
    21: 'c'
    """
    if leaf == 'a':
        return 19
    elif leaf == 'b':
        return 20
    elif leaf == 'c':
        return 21
    else:
        return leaf+9


def encode_node_to_1bit(node):
    """
    Nodes are represented as one bit (2 possibilities)
    0: '+'
    1: 'x'
    """
    return 0 if node == '+' else 1


def encode_preorders_to_seed(preorder, topic, difficulty, num_qns):
    """
    Given the (concatenated) preorder array of X questions, converts it into a binary
    string, then return its base64 representation as string

    The last character in the seed will always be 1, 2, or 3, denoting the difficulty
    Second last character will be the quiz length (0-9 represents 1-10 questions)
    Third last character will be the topic ('e' is expand, 'f' is factorise)
    """
    binary_string = ''
    for p in preorder:
        if p == '+' or p == 'x':
            binary_string += format(encode_node_to_1bit(p), '01b')
        else:
            binary_string += format(encode_leaf_to_5bit(p), '05b')
    return binarystring_to_base64(binary_string) + ('e' if topic == "Expand" else 'f') + str(num_qns - 1) + str(difficulty)


def decode_seed_to_preorders(seed):
    """
    Given the seed, return an array of the concatenated
    preorders of questions, as well as the topic, difficulty, 
    and number of qns
    """

    difficulty = int(seed[-1])
    num_qns = int(seed[-2]) + 1
    topic = seed[-3]

    if difficulty == 1:
        num_preorder_bits = HEIGHT_TWO_BITS
        struct = HEIGHT_TWO_STRUCT
    else:
        num_preorder_bits = HEIGHT_THREE_BITS
        struct = HEIGHT_THREE_STRUCT

    array_length = num_preorder_bits*num_qns
    raw_binarystring = base64_to_binarystring(seed[:-3])

    # Skip the offset of zeroes from base64-binary conversion, i.e.
    # len(raw_binarystring)-offset should be divisible by HEIGHT_TWO_BITS / HEIGHT_THREE_BITS
    offset = len(raw_binarystring) - array_length

    concatenated_preorders = []
    for i in range(offset, len(raw_binarystring), num_preorder_bits):
        ptr = 0
        for j in range(0, len(struct)):
            if struct[j] == 'I':
                concatenated_preorders.append(
                    decode_1bit_to_node(int(raw_binarystring[i+ptr], 2)))
                ptr += 1
            elif struct[j] == 'L':
                concatenated_preorders.append(
                    decode_5bit_to_leaf(int(raw_binarystring[i+ptr:i+ptr+5], 2)))
                ptr += 5

    return concatenated_preorders, topic, difficulty, num_qns


def base64_to_binarystring(base64_string):
    """
    Given a base64 string, returns its binary representation as string
    (Number of bits will be a multiple of 8)
    """

    # Convert the base64 string to bytes
    base64_bytes = base64_string.encode('utf-8')

    # Decode the base64 bytes to binary bytes
    binary_bytes = base64.b64decode(base64_bytes)

    # Convert the binary bytes to a binary string
    binary_string = ''.join(format(byte, '08b') for byte in binary_bytes)

    return binary_string


def binarystring_to_base64(binary_string):
    """
    Given a binary string, returns its base64 representation as string
    """

    # Convert the binary string to bytes
    binary_bytes = int(binary_string, 2).to_bytes(
        (len(binary_string)+7) // 8, byteorder='big')

    # Encode the bytes using base64
    base64_bytes = base64.b64encode(binary_bytes)

    # Convert the base64 bytes to a string, appending difficulty to the end
    return base64_bytes.decode('utf-8')


def base64_to_binarystring(base64_string):
    """
    Given a base64 string, returns its binary representation as a string
    """

    # Convert the base64 string to bytes
    base64_bytes = base64_string.encode('utf-8')

    # Decode the base64 bytes
    binary_bytes = base64.b64decode(base64_bytes)

    # Convert the binary bytes to a binary string
    binary_string = ''.join(format(byte, '08b') for byte in binary_bytes)

    return binary_string
