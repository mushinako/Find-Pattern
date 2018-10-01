#include <cmath>
#include <vector>

using namespace std;

int sum;
vector<int> sums;
map<int, int> factor;


void factor(int n, map<int, int>& f) {
    if (n == 1) return;
    int i = 2;
    whole_loop:
    while (n > i) for (;; i++) {
        if (!(n % i)) {
            n /= i;
        }
    }
}


int mu(int n) {
    // TODO: mu
}


void calc(int b, int p) {
    sum = 0;
    sums.clear();
    factor.clear();

    if (p == 1) {
        sum = b;
        vector<int> sums (b, 1);
        return;
    }

    // \frac{1}{p}\sum_{d|p}{\mu(\frac{p}{d})(b^d-(b-1)^d)} for exact ball
    // \frac{b^d}{p}\sum_{d|p}{\mu(\frac{p}{d})} for max ball
    vector<int> sums (b, 0);
    vector<int> dividers = divider(p);  // TODO: divider
    for (const int &x : dividers) {
        int m = mu(p / x);              // TODO: mu
        if (m) {
            sum += m * pow(b, x);
            for (int i = 0; i < b; i++) sums[i] += m * (pow(i+1, x) - pow(i, x));
        }
    }
    return;
}


int main(int argc, char const *argv[]) {
    int ball = 4;
    int period = 6;

    calc(ball, period);

    return 0;
}
