<?php namespace Repository;

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Pull extends \Eloquent {
    
    protected $fillable = array('lat', 'lng', 'address');

    use SoftDeletingTrait;

    public function confides() {
        return $this->hasMany("Repository\\Confide")
            ->select(array('pull_id','content','created_at'));
    }

    public static function post($data) {
        $pull = static::create($data);

        return $pull;
    }
}