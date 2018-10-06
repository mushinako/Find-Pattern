#include <cmath>
#include <vector>
#include <map>

using namespace std;

int sum;
vector<int> sums;
vector<int> dividers;


map<int, int> factor(int n, map<int, int>& f) {
    map<int, int> factors;
    if (n == 1) {
        return;
    }
    int i = 2;
    while (n > i) {
        for (;; ++i) {
            if (!(n % i)) {
                n /= i;
                if (factors.find(i) == factors.end()) {
                    factors[i] = 1;
                } else {
                    factors[i]++;
                }
                break;
            }
            if (i >= floor(sqrt(n))) {
                goto outta_loop;
            }
        }
    }
outta_loop:
    if (factors.find(n) == factors.end()) {
        factors[n] = 1;
    } else {
        factors[n]++;
    }
    return factors;
}


void divider(int n) {
    dividers.clear();

    if (n == 1) {
        return;
    }

    map<int, int> fs = factor(n);
    int count = 1;
    vector<int> nums, occs;
    for (map<int, int>::iterator i = fs.begin(); i != fs.end(); ++i) {
        nums.push_back(i->first);
        occs.push_back(i->second + 1);
        count *= (i->second + 1);
    }

    int conf;
    int c;
    for (int i = 0; i < count; ++i) {
        conf = 1;
        c = i;
        for (int j = 0; j < occs.size(); ++j) {
            conf *= pow(nums[j], c % occs[j]);
            c = floor(c / occs[j]);
        }
        dividers.push_back(conf);
    }

    sort(dividers.begin(), dividers.end());
}


int mu(int n) {
    // TODO: mu
    map<int, int> fs = factor(n);
    for (map<int, int>::iterator i = fs.begin(); i != fs.end(); ++i) {
        if (i->second > 1) {
            return 0;
        }
    }
    return (fs.size() % 2) ? -1 : 1;
}


void calc(int b, int p) {
    sum = 0;
    sums.clear();

    if (p == 1) {
        sum = b;
        vector<int> sums (b, 1);
        return;
    }

    // \frac{1}{p}\sum_{d|p}{\mu(\frac{p}{d})(b^d-(b-1)^d)} for exact ball
    // \frac{b^d}{p}\sum_{d|p}{\mu(\frac{p}{d})} for max ball
    vector<int> sums (b, 0);
    divider(p);
    for (const int &x : dividers) {
        int m = mu(p / x);              // TODO: mu
        if (m) {
            sum += m * pow(b, x);
            for (int i = 0; i < b; i++) {
                sums[i] += m * (pow(i+1, x) - pow(i, x));
            }
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
